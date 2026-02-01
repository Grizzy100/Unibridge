//server\user-service\src\routes\email.routes.ts
import { Router, Request, Response } from "express"
import { z } from "zod"
import prisma from "../utils/prisma.js"
import { Role } from "../generated/prisma/client.js"
import { requireServiceOrAdmin } from "../middleware/internal-access.middleware.js"

const router = Router()

const roleQuerySchema = z.object({
  role: z.nativeEnum(Role)
})

const filterQuerySchema = z.object({
  batch: z.string().optional(),
  school: z.string().optional(),
  year: z.coerce.number().int().optional(),
  semester: z.coerce.number().int().optional(),
  hostelBlock: z.string().optional()
})

const parentLookupSchema = z.object({
  studentIds: z.array(z.string().min(1)).min(1, "At least one student ID is required")
})

router.get("/email/lookup", requireServiceOrAdmin, async (req: Request, res: Response) => {
  try {
    const { email } = req.query
    if (!email || typeof email !== "string") {
      return res.status(400).json({ success: false, message: "Email required" })
    }

    const cleanEmail = email.trim().toLowerCase()

    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
      include: {
        studentProfile: true,
        teacherProfile: true,
        parentProfile: true,
        wardenProfile: true
      }
    })

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" })
    }

    let profileData: any = null
    if (user.role === "STUDENT") profileData = user.studentProfile
    if (user.role === "TEACHER") profileData = user.teacherProfile
    if (user.role === "PARENT") profileData = user.parentProfile
    if (user.role === "WARDEN") profileData = user.wardenProfile

    res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        role: user.role,
        profile: {
          firstName: profileData?.firstName || "User",
          lastName: profileData?.lastName || "Unknown",
          batch: profileData?.batch,
          school: profileData?.school,
          department: profileData?.department,
          hostelName: profileData?.hostelName
        }
      }
    })
  } catch (error: any) {
    console.error("[Email Integration] Lookup failed:", error.message)
    res.status(500).json({ success: false, message: "Internal server error during lookup" })
  }
})

router.get("/email/users-by-role", requireServiceOrAdmin, async (req: Request, res: Response) => {
  try {
    const validation = roleQuerySchema.safeParse(req.query)
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid Role provided"
      })
    }

    const { role } = validation.data

    const users = await prisma.user.findMany({
      where: { role },
      select: { id: true, email: true, role: true },
      orderBy: { createdAt: "desc" }
    })

    res.json({ success: true, count: users.length, data: users })
  } catch (error: any) {
    console.error("[Email Integration] Error fetching users by role:", error.message)
    res.status(500).json({ success: false, message: "Internal Server Error fetching users" })
  }
})

router.get("/email/courses/:courseId/students", requireServiceOrAdmin, async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params

    const courseExists = await prisma.course.findUnique({
      where: { id: courseId },
      select: { id: true }
    })

    if (!courseExists) {
      return res.status(404).json({ success: false, message: "Course not found" })
    }

    const enrollments = await prisma.courseEnrollment.findMany({
      where: { courseId },
      select: { student: { select: { userId: true } } }
    })

    const userIds = enrollments.map(e => e.student.userId).filter(Boolean)

    res.json({ success: true, count: userIds.length, data: userIds })
  } catch (error: any) {
    console.error("[Email Integration] Error getting course students:", error.message)
    res.status(500).json({ success: false, message: "Internal server error fetching course students" })
  }
})

router.get("/email/students", requireServiceOrAdmin, async (req: Request, res: Response) => {
  try {
    const validation = filterQuerySchema.safeParse(req.query)
    if (!validation.success) {
      return res.status(400).json({ success: false, message: "Invalid query parameters" })
    }

    const filters = validation.data

    const whereClause: any = {
      batch: filters.batch,
      year: filters.year,
      semester: filters.semester,
      hostelName: filters.hostelBlock
    }

    if (filters.school) whereClause.school = filters.school

    const students = await prisma.studentProfile.findMany({
      where: whereClause,
      select: { userId: true }
    })

    const userIds = students.map(s => s.userId)

    res.json({ success: true, count: userIds.length, data: userIds })
  } catch (error: any) {
    console.error("[Email Integration] Error filtering students:", error.message)
    res.status(500).json({ success: false, message: "Internal server error filtering students" })
  }
})

router.post("/email/students/parents", requireServiceOrAdmin, async (req: Request, res: Response) => {
  try {
    const validation = parentLookupSchema.safeParse(req.body)
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: validation.error.issues[0].message
      })
    }

    const { studentIds } = validation.data

    const parentLinks = await prisma.parentStudentLink.findMany({
      where: {
        student: { userId: { in: studentIds } }
      },
      select: {
        parent: { select: { userId: true } }
      },
      distinct: ["parentId"]
    })

    const uniqueIds = [...new Set(parentLinks.map(link => link.parent.userId))]

    res.json({ success: true, count: uniqueIds.length, data: uniqueIds })
  } catch (error: any) {
    console.error("[Email Integration] Error fetching parents:", error.message)
    res.status(500).json({ success: false, message: "Internal server error fetching parents" })
  }
})


router.get("/email/user-by-id", requireServiceOrAdmin, async (req: Request, res: Response) => {
  try {
    const { userId } = req.query

    if (!userId || typeof userId !== "string") {
      return res.status(400).json({ success: false, message: "userId required" })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        studentProfile: true,
        teacherProfile: true,
        parentProfile: true,
        wardenProfile: true
      }
    })

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" })
    }

    let profileData: any = null
    if (user.role === "STUDENT") profileData = user.studentProfile
    if (user.role === "TEACHER") profileData = user.teacherProfile
    if (user.role === "PARENT") profileData = user.parentProfile
    if (user.role === "WARDEN") profileData = user.wardenProfile

    return res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        role: user.role,
        profile: {
          firstName: profileData?.firstName || "User",
          lastName: profileData?.lastName || "Unknown",
          batch: profileData?.batch,
          school: profileData?.school,
          department: profileData?.department,
          semester: profileData?.semester,
          year: profileData?.year,
          hostelName: profileData?.hostelName
        }
      }
    })
  } catch (error: any) {
    console.error("[Email Integration] user-by-id failed:", error.message)
    return res.status(500).json({ success: false, message: "Internal server error" })
  }
})


export default router



