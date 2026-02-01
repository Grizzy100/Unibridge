// server/mail-service/src/repositories/read-receipt.repository.ts
import { prisma } from '../utils/prisma.js'

export interface CreateReadReceiptDTO {
  messageId: string
  userId: string
  ipAddress?: string
  userAgent?: string
}

class ReadReceiptRepository {
  async createReadReceipt(dto: CreateReadReceiptDTO) {
    // Use upsert to avoid duplicate read receipts
    return prisma.readReceipt.upsert({
      where: {
        messageId_userId: {
          messageId: dto.messageId,
          userId: dto.userId,
        },
      },
      update: {
        readAt: new Date(),
        ipAddress: dto.ipAddress,
        userAgent: dto.userAgent,
      },
      create: dto,
    })
  }

  async getReadReceiptsByMessageId(messageId: string) {
    return prisma.readReceipt.findMany({
      where: { messageId },
      orderBy: { readAt: 'asc' },
    })
  }

  async getReadReceiptCount(messageId: string): Promise<number> {
    return prisma.readReceipt.count({
      where: { messageId },
    })
  }

  async hasUserReadMessage(messageId: string, userId: string): Promise<boolean> {
    const receipt = await prisma.readReceipt.findUnique({
      where: {
        messageId_userId: {
          messageId,
          userId,
        },
      },
    })
    return receipt !== null
  }
}

export const readReceiptRepository = new ReadReceiptRepository()
