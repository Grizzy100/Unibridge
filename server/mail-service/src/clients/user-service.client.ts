// server/mail-service/src/clients/user-service.client.ts
// server/mail-service/src/clients/user-service.client.ts
import axios, { AxiosInstance } from "axios"
import { config } from "../config/index.js"
import { ExternalServiceError } from "../utils/errors.js"

export interface UserInfo {
  id: string
  email: string
  role: string
  profile: {
    firstName: string
    lastName: string
    batch?: string
    school?: string
    department?: string
    semester?: number
    year?: number
    hostelName?: string
    [key: string]: any
  }
}

class UserServiceClient {
  private client: AxiosInstance

  constructor() {
    console.log("🔹 UserServiceClient initialized with Base URL:", config.services.userServiceUrl)

    this.client = axios.create({
      baseURL: config.services.userServiceUrl,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
        "X-Service-Key": config.services.userServiceKey
      }
    })
  }

  // ✅ NEW: Uses the new /api/email/lookup endpoint (Source of Truth)
  async getUserByEmail(email: string): Promise<UserInfo | null> {
    try {
      const cleanEmail = email.trim().toLowerCase()

      console.log(`📡 [MailService] Requesting User Lookup for: ${cleanEmail}...`)

      const url = "/api/email/lookup"
      console.log(`   -> GET ${config.services.userServiceUrl}${url}?email=${cleanEmail}`)

      const { data } = await this.client.get(url, {
        params: { email: cleanEmail }
      })

      console.log("   <- Response Status:", data.success ? "SUCCESS" : "FAILED")

      if (data.success && data.data) {
        const u = data.data
        console.log(`✅ [MailService] User Found: ID=${u.id} Role=${u.role}`)

        return {
          id: u.id,
          email: u.email,
          role: u.role,
          profile: {
            firstName: u.profile?.firstName || "Unknown",
            lastName: u.profile?.lastName || "User",
            ...u.profile
          }
        }
      }

      return null
    } catch (error: any) {
      if (error.response) {
        console.error(`❌ [MailService] HTTP Error: ${error.response.status} ${error.response.statusText}`)

        if (error.response.status === 404) {
          console.warn(`   (This means User Service checked the DB and found nothing)`)
          return null
        }

        if (error.response.status === 401) {
          console.warn("   (Unauthorized: check X-Service-Key and SERVICE_KEY env values)")
        }

        if (error.response.status === 403) {
          console.warn("   (Forbidden: if using JWT admin auth, role must be ADMIN)")
        }
      } else if (error.request) {
        console.error("❌ [MailService] Network Error: No response received from User Service.")
        console.error(`   Is User Service running at ${config.services.userServiceUrl}?`)
      } else {
        console.error("❌ [MailService] Request Setup Error:", error.message)
      }

      throw new ExternalServiceError("user-service", error)
    }
  }

  // async getUserById(userId: string): Promise<UserInfo> {
  //   const endpoints = [
  //     `/api/profile/students/${userId}`,
  //     `/api/profile/teachers/${userId}`,
  //     `/api/profile/parents/${userId}`,
  //     `/api/profile/wardens/${userId}`,
  //   ]

  //   console.log("Testing endpoints:", endpoints.map(e => config.services.userServiceUrl + e))

  //   try {
  //     const response = await Promise.any(
  //       endpoints.map((url) =>
  //         this.client.get(url).then((res) => {
  //           if (!res.data.success) throw new Error("Not found")
  //           return { data: res.data, type: url }
  //         })
  //       )
  //     )

  //     if (response.type.includes("students")) return this.mapStudentToUserInfo(response.data.data)
  //     if (response.type.includes("teachers")) return this.mapTeacherToUserInfo(response.data.data)
  //     if (response.type.includes("parents")) return this.mapParentToUserInfo(response.data.data)
  //     if (response.type.includes("wardens")) return this.mapWardenToUserInfo(response.data.data)

        
  //   } catch (err) {

  //   }

  //   return {
  //     id: userId,
  //     email: "unknown@example.com",
  //     role: "USER",
  //     profile: { firstName: "Unknown", lastName: "User" }
  //   }
  // }




  async getUserById(userId: string): Promise<UserInfo> {
  try {
    const { data } = await this.client.get("/api/email/user-by-id", {
      params: { userId }
    })

    if (data?.success && data?.data) {
      const u = data.data
      return {
        id: u.id,
        email: u.email,
        role: u.role,
        profile: {
          firstName: u.profile?.firstName || "User",
          lastName: u.profile?.lastName || "Unknown",
          ...u.profile
        }
      }
    }
  } catch (error: any) {
    console.error("getUserById failed:", error?.response?.status, error?.response?.data || error?.message)
  }

  return {
    id: userId,
    email: "unknown@example.com",
    role: "USER",
    profile: { firstName: "Unknown", lastName: "User" }
  }
}



  async getUsersByIds(userIds: string[]): Promise<UserInfo[]> {
    const promises = userIds.map((id) => this.getUserById(id).catch(() => null))
    const results = await Promise.all(promises)
    return results.filter((r): r is UserInfo => r !== null)
  }

  private mapStudentToUserInfo(student: any): UserInfo {
    return {
      id: student.userId,
      email: student.email || student.user?.email || "",
      role: "STUDENT",
      profile: {
        firstName: student.firstName,
        lastName: student.lastName,
        batch: student.batch,
        school: student.school,
        department: student.department,
        semester: student.semester,
        year: student.year,
        hostelName: student.hostelName
      }
    }
  }

  private mapTeacherToUserInfo(teacher: any): UserInfo {
    return {
      id: teacher.userId,
      email: teacher.email || teacher.user?.email || "",
      role: "TEACHER",
      profile: { firstName: teacher.firstName, lastName: teacher.lastName }
    }
  }

  private mapParentToUserInfo(parent: any): UserInfo {
    return {
      id: parent.userId,
      email: parent.email || parent.user?.email || "",
      role: "PARENT",
      profile: { firstName: parent.firstName, lastName: parent.lastName }
    }
  }

  private mapWardenToUserInfo(warden: any): UserInfo {
    return {
      id: warden.userId,
      email: warden.email || warden.user?.email || "",
      role: "WARDEN",
      profile: { firstName: warden.firstName, lastName: warden.lastName }
    }
  }

  private async fetchStudentsByFilter(key: string, value: any): Promise<UserInfo[]> {
    try {
      const { data } = await this.client.get("/api/profiles/students")
      if (!data.success) return []
      return data.data
        .filter((s: any) => s[key] === value)
        .map((s: any) => this.mapStudentToUserInfo(s))
    } catch (error) {
      return []
    }
  }

  async getStudentsByBatch(batch: string): Promise<UserInfo[]> { return this.fetchStudentsByFilter("batch", batch) }
  async getStudentsBySchool(school: string): Promise<UserInfo[]> { return this.fetchStudentsByFilter("school", school) }
  async getStudentsByDepartment(dept: string): Promise<UserInfo[]> { return this.fetchStudentsByFilter("department", dept) }
  async getStudentsByYear(year: number): Promise<UserInfo[]> { return this.fetchStudentsByFilter("year", year) }
  async getStudentsBySemester(sem: number): Promise<UserInfo[]> { return this.fetchStudentsByFilter("semester", sem) }
  async getStudentsByHostel(hostel: string): Promise<UserInfo[]> { return this.fetchStudentsByFilter("hostelName", hostel) }

  async getStudentsByCourse(courseId: string): Promise<UserInfo[]> {
    try {
      const { data } = await this.client.get(`/api/email/courses/${courseId}/students`)
      if (!data.success) return []
      return this.getUsersByIds(data.data)
    } catch (error) {
      return []
    }
  }

  async getUsersByRole(role: string): Promise<UserInfo[]> {
    try {
      let endpoint = ""
      let mapper: (data: any) => UserInfo

      switch (role.toUpperCase()) {
        case "STUDENT": endpoint = "/api/profiles/students"; mapper = this.mapStudentToUserInfo.bind(this); break
        case "TEACHER": endpoint = "/api/profiles/teachers"; mapper = this.mapTeacherToUserInfo.bind(this); break
        case "PARENT": endpoint = "/api/profiles/parents"; mapper = this.mapParentToUserInfo.bind(this); break
        case "WARDEN": endpoint = "/api/profiles/wardens"; mapper = this.mapWardenToUserInfo.bind(this); break
        default: return []
      }

      const { data } = await this.client.get(endpoint)
      if (!data.success) return []
      return data.data.map((item: any) => mapper(item))
    } catch (error) {
      return []
    }
  }

  async getParentsByStudentId(studentId: string): Promise<string[]> {
    try {
      const { data } = await this.client.get(`/api/profiles/students/${studentId}/parents`)
      if (!data.success) return []
      return data.data.map((p: any) => p.userId || p.id)
    } catch (error) {
      return []
    }
  }
}

export const userServiceClient = new UserServiceClient()








