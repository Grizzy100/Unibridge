// server/mail-service/src/services/target-resolver.service.ts
import { userServiceClient } from '../clients/user-service.client.js'
import { TargetKind } from '../generated/prisma/client.js'
import { ValidationError, ExternalServiceError } from '../utils/errors.js'

export interface Target {
  kind: TargetKind
  value: string
}

class TargetResolverService {
  async resolveTargets(targets: Target[]): Promise<{ userIds: string[]; resolvedCount: number }> {
    if (!targets || !Array.isArray(targets)) return { userIds: [], resolvedCount: 0 }

    // ✅ FIX: Parallel Execution
    const resolutionPromises = targets.map(target => this.resolveTarget(target))
    
    // Wait for all HTTP requests to finish
    const results = await Promise.all(resolutionPromises)

    // Flatten results
    const userIdSet = new Set<string>()
    results.flat().forEach(userId => userIdSet.add(userId))

    return {
      userIds: Array.from(userIdSet),
      resolvedCount: userIdSet.size,
    }
  }

  private async resolveTarget(target: Target): Promise<string[]> {
    try {
      switch (target.kind) {
        case TargetKind.USER:
          return [target.value]
        
        case TargetKind.EMAIL:
          const user = await userServiceClient.getUserByEmail(target.value)
          if (!user) {
            // Log warning but don't crash whole process? 
            // Better to throw Validation Error so sender knows address is wrong.
            throw new ValidationError(`Recipient email not registered: ${target.value}`)
          }
          return [user.id]
        
        case TargetKind.ROLE:
          const roleUsers = await userServiceClient.getUsersByRole(target.value)
          return roleUsers.map((u) => u.id)
        
        case TargetKind.BATCH:
          const batchStudents = await userServiceClient.getStudentsByBatch(target.value)
          return batchStudents.map((u) => u.id)
        
        case TargetKind.COURSE:
          const courseStudents = await userServiceClient.getStudentsByCourse(target.value)
          return courseStudents.map((u) => u.id)
        
        case TargetKind.SCHOOL:
          const schoolStudents = await userServiceClient.getStudentsBySchool(target.value)
          return schoolStudents.map((u) => u.id)
        
        case TargetKind.DEPARTMENT:
          const deptStudents = await userServiceClient.getStudentsByDepartment(target.value)
          return deptStudents.map((u) => u.id)
        
        case TargetKind.YEAR:
          const yearStudents = await userServiceClient.getStudentsByYear(parseInt(target.value))
          return yearStudents.map((u) => u.id)
        
        case TargetKind.SEMESTER:
          const semStudents = await userServiceClient.getStudentsBySemester(parseInt(target.value))
          return semStudents.map((u) => u.id)
        
        case TargetKind.HOSTEL_BLOCK:
          const hostelStudents = await userServiceClient.getStudentsByHostel(target.value)
          return hostelStudents.map((u) => u.id)
        
        default:
          console.warn(`Unknown target kind: ${target.kind}`)
          return []
      }
    } catch (error) {
      if (error instanceof ValidationError) throw error
      console.error(`Failed to resolve target ${target.kind}:${target.value}`, error)
      return [] // Return empty if service fails, rather than crashing everything
    }
  }
}

export const targetResolverService = new TargetResolverService()








