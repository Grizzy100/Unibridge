
//server/mail-service/src/repositories/target.repository.ts
import { prisma } from '../utils/prisma.js'
import { TargetKind } from '../generated/prisma/client.js'
export interface CreateTargetDTO {
  messageId: string
  kind: TargetKind
  value: string
  resolvedCount?: number
}
class TargetRepository {
  async createTargets(targets: CreateTargetDTO[]) {
    return prisma.messageTarget.createMany({
      data: targets,
    })
  }
  async updateResolvedCount(messageId: string, kind: TargetKind, value: string, count: number) {
    return prisma.messageTarget.updateMany({
      where: { messageId, kind, value },
      data: { resolvedCount: count },
    })
  }
  async getTargetsByMessage(messageId: string) {
    return prisma.messageTarget.findMany({
      where: { messageId },
    })
  }
}
export const targetRepository = new TargetRepository()
