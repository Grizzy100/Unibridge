// server/mail-service/src/services/message.service.ts
import { prisma } from '../utils/prisma.js'
import { messageRepository } from '../repositories/message.repository.js'
import { targetRepository } from '../repositories/target.repository.js'
import { userServiceClient } from '../clients/user-service.client.js'
import { cloudinaryService } from './cloudinary.service.js'
import { targetResolverService } from './target-resolver.service.js'
import { readReceiptRepository } from '../repositories/read-receipt.repository.js'
import { MessageType, RecipientType, FolderType, TargetKind } from '../generated/prisma/client.js'
import { ValidationError, NotFoundError, ForbiddenError } from '../utils/errors.js'


export interface Target {
  kind: TargetKind
  value: string
}


export interface SendMessageDTO {
  senderId: string
  targets: Target[]
  ccTargets?: Target[]
  bccTargets?: Target[]
  subject: string
  body: string
  type: MessageType
  attachments?: Express.Multer.File[]
}


export interface SaveDraftDTO {
  senderId: string
  subject?: string
  body?: string
  type?: MessageType
  targets?: Target[]
}

// ✅ ADD: Type definitions for recipients
interface RecipientWithType {
  id: string
  name: string
  email: string
  recipientType: RecipientType
}

interface RecipientData {
  id: string
  name: string
  email: string
}


class MessageService {
  // ✅ OPTIMIZED: Batch transform multiple messages at once
  private async transformMessages(participants: any[]) {
    if (participants.length === 0) return []

    // Step 1: Collect all unique user IDs from all messages
    const allUserIds = new Set<string>()
    participants.forEach(participant => {
      const msg = participant.message
      msg.participants?.forEach((p: any) => {
        if (p.userId) allUserIds.add(p.userId)
      })
    })

    // Step 2: Batch fetch all users in ONE API call
    console.log(`[MessageService] Batch fetching ${allUserIds.size} unique users...`)
    const userIds = Array.from(allUserIds)
    const users = await userServiceClient.getUsersByIds(userIds)
    
    // Step 3: Create user lookup map for O(1) access
    const userMap = new Map()
    users.forEach(user => {
      userMap.set(user.id, user)
    })

    // Step 4: Transform all messages using the cached user data
    return participants.map(participant => {
      const msg = participant.message

      // ✅ FIXED: Add explicit type annotation
      const allRecipients: RecipientWithType[] = msg.participants
        .filter((p: any) => p.recipientType !== RecipientType.SENDER)
        .map((p: any) => {
          const user = userMap.get(p.userId)
          if (!user) {
            console.warn(`User ${p.userId} not found in batch result`)
            return {
              id: p.userId,
              name: 'Unknown User',
              email: '',
              recipientType: p.recipientType,
            }
          }
          return {
            id: p.userId,
            name: `${user.profile.firstName} ${user.profile.lastName}`.trim(),
            email: user.email,
            recipientType: p.recipientType,
          }
        })

      // ✅ FIXED: Explicit type for destructured parameters
      const toRecipients: RecipientData[] = allRecipients
        .filter((r: RecipientWithType) => r.recipientType === RecipientType.TO)
        .map((r: RecipientWithType): RecipientData => ({ 
          id: r.id, 
          name: r.name, 
          email: r.email 
        }))
      
      const ccRecipients: RecipientData[] = allRecipients
        .filter((r: RecipientWithType) => r.recipientType === RecipientType.CC)
        .map((r: RecipientWithType): RecipientData => ({ 
          id: r.id, 
          name: r.name, 
          email: r.email 
        }))
      
      const bccRecipients: RecipientData[] = allRecipients
        .filter((r: RecipientWithType) => r.recipientType === RecipientType.BCC)
        .map((r: RecipientWithType): RecipientData => ({ 
          id: r.id, 
          name: r.name, 
          email: r.email 
        }))

      return {
        id: participant.id,
        messageId: participant.messageId,
        subject: msg.subject || "No Subject",
        body: msg.body || "",
        senderId: msg.senderId,
        senderName: msg.senderName || "Unknown",
        senderEmail: msg.senderEmail || "",
        type: msg.type,
        createdAt: msg.createdAt.toISOString(),
        readAt: participant.readAt?.toISOString() || null,
        flagged: participant.flagged,
        folder: participant.folder,
        recipientType: participant.recipientType,

        recipients: toRecipients,
        to: toRecipients,
        cc: ccRecipients,
        bcc: bccRecipients,

        attachments: msg.attachments.map((a: any) => ({
          id: a.id,
          filename: a.filename,
          url: a.url,
          mimeType: a.mimeType,
          size: a.size,
        })),
      }
    })
  }

  // ✅ Helper for single message (used in getMessageById)
  private async transformSingleMessage(participant: any) {
    const results = await this.transformMessages([participant])
    return results[0]
  }


  async sendMessage(dto: SendMessageDTO) {
    if (!dto.targets || dto.targets.length === 0) throw new ValidationError('At least one target is required')
    if (!dto.subject?.trim()) throw new ValidationError('Subject is required')
    if (!dto.body?.trim()) throw new ValidationError('Body is required')

    const [senderInfo, toResult, ccResult, bccResult] = await Promise.all([
      userServiceClient.getUserById(dto.senderId),
      targetResolverService.resolveTargets(dto.targets),
      dto.ccTargets ? targetResolverService.resolveTargets(dto.ccTargets) : { userIds: [] },
      dto.bccTargets ? targetResolverService.resolveTargets(dto.bccTargets) : { userIds: [] }
    ])

    const toUserIds = toResult.userIds
    const ccUserIds = ccResult.userIds || []
    const bccUserIds = bccResult.userIds || []

    if (toUserIds.length === 0) throw new ValidationError('No valid recipients found in TO field')

    let uploadedAttachments: any[] = []
    if (dto.attachments && dto.attachments.length > 0) {
      uploadedAttachments = await cloudinaryService.uploadMultiple(dto.attachments)
    }

    const studentIds = new Set([...toUserIds, ...ccUserIds])
    const parentIds = new Set<string>()
    const parentPromises = Array.from(studentIds).map(id => userServiceClient.getParentsByStudentId(id).catch(() => []))
    const parentResults = await Promise.all(parentPromises)
    parentResults.flat().forEach(pid => parentIds.add(pid))

    const result = await prisma.$transaction(async (tx) => {
      const message = await tx.message.create({
        data: {
          senderId: dto.senderId,
          senderName: `${senderInfo.profile.firstName} ${senderInfo.profile.lastName}`,
          senderEmail: senderInfo.email,
          subject: dto.subject,
          body: dto.body,
          type: dto.type,
        }
      })

      const allTargets = [
        ...dto.targets.map(t => ({ messageId: message.id, ...t })),
        ...(dto.ccTargets || []).map(t => ({ messageId: message.id, ...t })),
        ...(dto.bccTargets || []).map(t => ({ messageId: message.id, ...t })),
      ]
      if (allTargets.length > 0) {
        await tx.messageTarget.createMany({ data: allTargets })
      }

      const participants: any[] = []
      const processedIds = new Set<string>()

      const addParticipant = (uid: string, type: RecipientType, folder: FolderType) => {
        if (!processedIds.has(uid) && uid !== dto.senderId) {
          participants.push({
            messageId: message.id,
            userId: uid,
            recipientType: type,
            folder: folder
          })
          processedIds.add(uid)
        }
      }

      participants.push({
        messageId: message.id,
        userId: dto.senderId,
        recipientType: RecipientType.SENDER,
        folder: FolderType.SENT,
        readAt: new Date()
      })

      toUserIds.forEach(id => addParticipant(id, RecipientType.TO, FolderType.INBOX))
      ccUserIds.forEach(id => addParticipant(id, RecipientType.CC, FolderType.INBOX))
      bccUserIds.forEach(id => addParticipant(id, RecipientType.BCC, FolderType.INBOX))
      parentIds.forEach(id => addParticipant(id, RecipientType.BCC, FolderType.INBOX))

      if (participants.length > 0) {
        await tx.messageParticipant.createMany({ data: participants })
      }

      if (uploadedAttachments.length > 0) {
        await tx.attachment.createMany({
          data: uploadedAttachments.map(att => ({
            messageId: message.id,
            filename: att.filename,
            url: att.url,
            mimeType: att.mimeType,
            size: att.size,
            cloudinaryId: att.cloudinaryId,
          }))
        })
      }

      return {
        messageId: message.id,
        recipientCount: participants.length - 1,
        attachmentCount: uploadedAttachments.length
      }
    }, { maxWait: 5000, timeout: 10000 })

    return result
  }


  async saveDraft(dto: SaveDraftDTO) {
    const message = await messageRepository.saveDraft({
      senderId: dto.senderId,
      subject: dto.subject || 'Untitled',
      body: dto.body || '',
      type: dto.type || MessageType.GENERAL,
    })
    if (dto.targets && dto.targets.length > 0) {
      await targetRepository.createTargets(
        dto.targets.map((t) => ({ messageId: message.id, ...t }))
      )
    }
    return { messageId: message.id }
  }


  async updateDraft(messageId: string, userId: string, data: Partial<SaveDraftDTO>) {
    const message = await messageRepository.getMessageById(messageId)
    if (!message) throw new NotFoundError('Draft')
    const isDraft = message.participants.some((p) => p.userId === userId && p.folder === FolderType.DRAFT)
    if (!isDraft) throw new ForbiddenError('Not a draft or access denied')
    return messageRepository.updateMessage(messageId, data as any)
  }


  // ✅ OPTIMIZED: Batch transform all messages at once
  async getInbox(userId: string, page = 1, limit = 20) {
    const result = await messageRepository.getMessagesByFolder(userId, FolderType.INBOX, page, limit)
    const messages = await this.transformMessages(result.messages)

    return {
      messages,
      total: result.total,
      page: result.page,
      totalPages: result.totalPages,
    }
  }


  async getSentMessages(userId: string, page = 1, limit = 20) {
    const result = await messageRepository.getMessagesByFolder(userId, FolderType.SENT, page, limit)
    const messages = await this.transformMessages(result.messages)

    return {
      messages,
      total: result.total,
      page: result.page,
      totalPages: result.totalPages,
    }
  }


  async getDrafts(userId: string, page = 1, limit = 20) {
    const result = await messageRepository.getMessagesByFolder(userId, FolderType.DRAFT, page, limit)
    const messages = await this.transformMessages(result.messages)

    return {
      messages,
      total: result.total,
      page: result.page,
      totalPages: result.totalPages,
    }
  }


  async getTrash(userId: string, page = 1, limit = 20) {
    const result = await messageRepository.getMessagesByFolder(userId, FolderType.TRASH, page, limit)
    const messages = await this.transformMessages(result.messages)

    return {
      messages,
      total: result.total,
      page: result.page,
      totalPages: result.totalPages,
    }
  }


  // async getArchive(userId: string, page = 1, limit = 20) {
  //   const result = await messageRepository.getMessagesByFolder(userId, FolderType.ARCHIVE, page, limit)
  //   const messages = await this.transformMessages(result.messages)

  //   return {
  //     messages,
  //     total: result.total,
  //     page: result.page,
  //     totalPages: result.totalPages,
  //   }
  // }


  async getArchive(userId: string, page = 1, limit = 20) {
    console.log(`[Service] getArchive:`, { userId, page, limit })
    
    const result = await messageRepository.getMessagesByFolder(userId, FolderType.ARCHIVE, page, limit)
    
    console.log(`[Service] Raw query returned:`, {
      messagesCount: result.messages.length,
      total: result.total
    })
    
    const messages = await this.transformMessages(result.messages)

    console.log(`[Service] After transform:`, {
      messagesCount: messages.length
    })

    return {
      messages,
      total: result.total,
      page: result.page,
      totalPages: result.totalPages,
    }
  }


  async getMessageById(messageId: string, userId: string) {
    const message = await messageRepository.getMessageById(messageId)
    if (!message) throw new NotFoundError('Message')
    const hasAccess = message.participants.some((p) => p.userId === userId)
    if (!hasAccess) throw new ForbiddenError('Access denied')
    
    const userParticipant = message.participants.find((p) => p.userId === userId)
    if (userParticipant?.recipientType === RecipientType.BCC) {
      message.participants = message.participants.filter((p) => p.recipientType === RecipientType.TO || p.userId === userId)
    } else if (userParticipant?.recipientType !== RecipientType.SENDER) {
      message.participants = message.participants.filter((p) => p.recipientType !== RecipientType.BCC || p.userId === userId)
    }
    
    return this.transformSingleMessage({
      ...userParticipant,
      message
    })
  }


  async markAsRead(messageId: string, userId: string, metadata?: { ipAddress?: string; userAgent?: string }) {
    await messageRepository.markAsRead(messageId, userId)
    await readReceiptRepository.createReadReceipt({
      messageId,
      userId,
      ipAddress: metadata?.ipAddress,
      userAgent: metadata?.userAgent,
    })
    return { success: true }
  }


  async moveToTrash(messageId: string, userId: string) {
    return messageRepository.softDelete(messageId, userId)
  }


  // async moveToArchive(messageId: string, userId: string) {
  //   return messageRepository.moveToFolder(messageId, userId, FolderType.ARCHIVE)
  // }


  async moveToArchive(messageId: string, userId: string) {
    console.log(`[Service] Moving to archive:`, { messageId, userId })
  
    const result = await messageRepository.moveToFolder(messageId, userId, FolderType.ARCHIVE)
  
    console.log(`[Service] Archive result:`, result) 
    return result
  }


  async moveToFolder(messageId: string, userId: string, targetFolder: string) {
    console.log(`[Service] Moving message to folder:`, { messageId, userId, targetFolder })

    // Map string to FolderType enum
    const folderMap: Record<string, FolderType> = {
      'INBOX': FolderType.INBOX,
      'SENT': FolderType.SENT,
      'DRAFT': FolderType.DRAFT,
      'TRASH': FolderType.TRASH,
      'ARCHIVE': FolderType.ARCHIVE
    }

    const folder = folderMap[targetFolder.toUpperCase()]
    
    if (!folder) {
      throw new ValidationError(`Invalid folder: ${targetFolder}`)
    }

    return messageRepository.moveToFolder(messageId, userId, folder)
  }


  async permanentDelete(messageId: string, userId: string) {
    const message = await messageRepository.getMessageById(messageId)
    if (message && message.attachments.length > 0) {
      await cloudinaryService.deleteMultiple(message.attachments.map((a) => a.cloudinaryId))
    }
    return messageRepository.permanentDelete(messageId, userId)
  }


  async toggleFlag(messageId: string, userId: string) {
    return messageRepository.toggleFlag(messageId, userId)
  }


  async getUnreadCount(userId: string) {
    return messageRepository.getUnreadCount(userId)
  }


  async searchMessages(userId: string, query: string, page = 1, limit = 20) {
    if (!query?.trim()) throw new ValidationError('Search query is required')
    const result = await messageRepository.searchMessages(userId, query.trim(), page, limit)
    const messages = await this.transformMessages(result.messages)

    return {
      messages,
      total: result.total,
      page: result.page,
      totalPages: result.totalPages,
    }
  }


  // async replyToMessage(originalMessageId: string, replyDto: { senderId: string; body: string; replyToAll?: boolean; attachments?: Express.Multer.File[] }) {
  //   const originalMessage = await messageRepository.getMessageById(originalMessageId)
  //   if (!originalMessage) throw new NotFoundError('Original message')
  //   const hasAccess = originalMessage.participants.some((p) => p.userId === replyDto.senderId)
  //   if (!hasAccess) throw new ForbiddenError('Cannot reply to message you do not have access to')

  //   const senderInfo = await userServiceClient.getUserById(replyDto.senderId)
  //   const senderName = `${senderInfo.profile.firstName} ${senderInfo.profile.lastName}`
  //   const senderEmail = senderInfo.email

  //   let recipientIds: string[] = []
  //   if (replyDto.replyToAll) {
  //     recipientIds = originalMessage.participants
  //       .filter((p) => p.recipientType !== RecipientType.BCC && p.userId !== replyDto.senderId)
  //       .map((p) => p.userId)
  //   } else {
  //     recipientIds = [originalMessage.senderId]
  //   }
  //   recipientIds = [...new Set(recipientIds)]
  //   if (recipientIds.length === 0) throw new ValidationError('No valid recipients for reply')

  //   let uploadedAttachments: any[] = []
  //   if (replyDto.attachments && replyDto.attachments.length > 0) {
  //     uploadedAttachments = await cloudinaryService.uploadMultiple(replyDto.attachments)
  //   }

  //   const threadId = originalMessage.threadId || originalMessage.id
  //   const subject = originalMessage.subject.startsWith('Re: ') ? originalMessage.subject : `Re: ${originalMessage.subject}`

  //   const replyMessage = await messageRepository.createMessage({
  //     senderId: replyDto.senderId,
  //     senderName,
  //     senderEmail,
  //     subject,
  //     body: replyDto.body,
  //     type: originalMessage.type,
  //     threadId,
  //   })

  //   const participants: any[] = []
  //   participants.push({
  //     messageId: replyMessage.id,
  //     userId: replyDto.senderId,
  //     recipientType: RecipientType.SENDER,
  //     folder: FolderType.SENT,
  //   })
  //   recipientIds.forEach((recipientId) => {
  //     participants.push({
  //       messageId: replyMessage.id,
  //       userId: recipientId,
  //       recipientType: RecipientType.TO,
  //       folder: FolderType.INBOX,
  //     })
  //   })

  //   await messageRepository.createParticipants(participants)

  //   if (uploadedAttachments.length > 0) {
  //     await messageRepository.createAttachments(
  //       uploadedAttachments.map((att) => ({
  //         messageId: replyMessage.id,
  //         filename: att.filename,
  //         url: att.url,
  //         mimeType: att.mimeType,
  //         size: att.size,
  //         cloudinaryId: att.cloudinaryId,
  //       }))
  //     )
  //   }

  //   return {
  //     messageId: replyMessage.id,
  //     threadId,
  //     recipientCount: recipientIds.length,
  //     attachmentCount: uploadedAttachments.length,
  //   }
  // }
  
  async replyToMessage(originalMessageId: string, replyDto: { senderId: string; body: string; replyToAll?: boolean; attachments?: Express.Multer.File[] }) {
  const originalMessage = await messageRepository.getMessageById(originalMessageId)
  if (!originalMessage) throw new NotFoundError('Original message')
  const hasAccess = originalMessage.participants.some((p) => p.userId === replyDto.senderId)
  if (!hasAccess) throw new ForbiddenError('Cannot reply to message you do not have access to')

  // ✅ ADD: Mark original message as read when replying
  await this.markAsRead(originalMessageId, replyDto.senderId)

  const senderInfo = await userServiceClient.getUserById(replyDto.senderId)
  const senderName = `${senderInfo.profile.firstName} ${senderInfo.profile.lastName}`
  const senderEmail = senderInfo.email

  let recipientIds: string[] = []
  if (replyDto.replyToAll) {
    recipientIds = originalMessage.participants
      .filter((p) => p.recipientType !== RecipientType.BCC && p.userId !== replyDto.senderId)
      .map((p) => p.userId)
  } else {
    recipientIds = [originalMessage.senderId]
  }
  recipientIds = [...new Set(recipientIds)]
  if (recipientIds.length === 0) throw new ValidationError('No valid recipients for reply')

  let uploadedAttachments: any[] = []
  if (replyDto.attachments && replyDto.attachments.length > 0) {
    uploadedAttachments = await cloudinaryService.uploadMultiple(replyDto.attachments)
  }

  const threadId = originalMessage.threadId || originalMessage.id
  const subject = originalMessage.subject.startsWith('Re: ') ? originalMessage.subject : `Re: ${originalMessage.subject}`

  // ✅ USE TRANSACTION to ensure all operations complete
  const result = await prisma.$transaction(async (tx) => {
    const replyMessage = await tx.message.create({
      data: {
        senderId: replyDto.senderId,
        senderName,
        senderEmail,
        subject,
        body: replyDto.body,
        type: originalMessage.type,
        threadId,
      }
    })

    const participants: any[] = []
    participants.push({
      messageId: replyMessage.id,
      userId: replyDto.senderId,
      recipientType: RecipientType.SENDER,
      folder: FolderType.SENT,
      readAt: new Date(), // ✅ ADD: Sender has read their own sent message
    })
    recipientIds.forEach((recipientId) => {
      participants.push({
        messageId: replyMessage.id,
        userId: recipientId,
        recipientType: RecipientType.TO,
        folder: FolderType.INBOX,
      })
    })

    await tx.messageParticipant.createMany({ data: participants })

    if (uploadedAttachments.length > 0) {
      await tx.attachment.createMany({
        data: uploadedAttachments.map((att) => ({
          messageId: replyMessage.id,
          filename: att.filename,
          url: att.url,
          mimeType: att.mimeType,
          size: att.size,
          cloudinaryId: att.cloudinaryId,
        }))
      })
    }

    return {
      messageId: replyMessage.id,
      threadId,
      recipientCount: recipientIds.length,
      attachmentCount: uploadedAttachments.length,
    }
  })

  return result
}


  async getReadReceipts(messageId: string, requesterId: string) {
    const message = await messageRepository.getMessageById(messageId)
    if (!message) throw new NotFoundError('Message')
    if (message.senderId !== requesterId) throw new ForbiddenError('Only sender can view read receipts')
    const receipts = await readReceiptRepository.getReadReceiptsByMessageId(messageId)
    const totalRecipients = message.participants.filter((p) => p.recipientType !== RecipientType.SENDER).length
    
    // ✅ Batch fetch receipt user info
    const userIds = receipts.map((r: any) => r.userId)
    const users = await userServiceClient.getUsersByIds(userIds)
    const userMap = new Map(users.map(u => [u.id, u]))

    const receiptsWithUserInfo = receipts.map((receipt: any) => {
      const user = userMap.get(receipt.userId)
      return {
        userId: receipt.userId,
        userName: user ? `${user.profile.firstName} ${user.profile.lastName}` : 'Unknown User',
        userEmail: user?.email || '',
        readAt: receipt.readAt,
      }
    })

    return {
      messageId,
      totalRecipients,
      readCount: receipts.length,
      unreadCount: totalRecipients - receipts.length,
      readBy: receiptsWithUserInfo,
    }
  }
}


export const messageService = new MessageService()












// import { prisma } from '../utils/prisma.js'
// import { messageRepository } from '../repositories/message.repository.js'
// import { targetRepository } from '../repositories/target.repository.js'
// import { userServiceClient } from '../clients/user-service.client.js'
// import { cloudinaryService } from './cloudinary.service.js'
// import { targetResolverService } from './target-resolver.service.js'
// import { readReceiptRepository } from '../repositories/read-receipt.repository.js'
// import { MessageType, RecipientType, FolderType, TargetKind } from '../generated/prisma/client.js'
// import { ValidationError, NotFoundError, ForbiddenError } from '../utils/errors.js'

// export interface Target {
//   kind: TargetKind
//   value: string
// }

// export interface SendMessageDTO {
//   senderId: string
//   targets: Target[]
//   ccTargets?: Target[]
//   bccTargets?: Target[]
//   subject: string
//   body: string
//   type: MessageType
//   attachments?: Express.Multer.File[]
// }

// export interface SaveDraftDTO {
//   senderId: string
//   subject?: string
//   body?: string
//   type?: MessageType
//   targets?: Target[]
// }

// class MessageService {
//   // ✅ CRITICAL: Transform Prisma data to frontend format
//   private async transformMessage(participant: any) {
//   const msg = participant.message

//   const recipients = await Promise.all(
//     msg.participants
//       .filter((p: any) => p.recipientType !== RecipientType.SENDER)
//       .map(async (p: any) => {
//         const user = await userServiceClient.getUserById(p.userId)
//         return {
//           id: p.userId,
//           name: `${user.profile.firstName} ${user.profile.lastName}`,
//           email: user.email,
//           recipientType: p.recipientType,
//         }
//       })
//   )

//   return {
//     id: participant.id,
//     messageId: participant.messageId,
//     subject: msg.subject || "No Subject",
//     body: msg.body || "",
//     senderId: msg.senderId,
//     senderName: msg.senderName || "Unknown",
//     senderEmail: msg.senderEmail || "",
//     type: msg.type,
//     createdAt: msg.createdAt.toISOString(),
//     readAt: participant.readAt?.toISOString() || null,
//     flagged: participant.flagged,
//     folder: participant.folder,
//     recipientType: participant.recipientType,

//     // ✅ NOW frontend finally gets name + email
//     recipients,

//     attachments: msg.attachments.map((a: any) => ({
//       id: a.id,
//       filename: a.filename,
//       url: a.url,
//       mimeType: a.mimeType,
//       size: a.size,
//     })),
//   }
// }



//   async sendMessage(dto: SendMessageDTO) {
//     if (!dto.targets || dto.targets.length === 0) throw new ValidationError('At least one target is required')
//     if (!dto.subject?.trim()) throw new ValidationError('Subject is required')
//     if (!dto.body?.trim()) throw new ValidationError('Body is required')

//     const [senderInfo, toResult, ccResult, bccResult] = await Promise.all([
//       userServiceClient.getUserById(dto.senderId),
//       targetResolverService.resolveTargets(dto.targets),
//       dto.ccTargets ? targetResolverService.resolveTargets(dto.ccTargets) : { userIds: [] },
//       dto.bccTargets ? targetResolverService.resolveTargets(dto.bccTargets) : { userIds: [] }
//     ])

//     const toUserIds = toResult.userIds
//     const ccUserIds = ccResult.userIds || []
//     const bccUserIds = bccResult.userIds || []

//     if (toUserIds.length === 0) throw new ValidationError('No valid recipients found in TO field')

//     let uploadedAttachments: any[] = []
//     if (dto.attachments && dto.attachments.length > 0) {
//       uploadedAttachments = await cloudinaryService.uploadMultiple(dto.attachments)
//     }

//     const studentIds = new Set([...toUserIds, ...ccUserIds])
//     const parentIds = new Set<string>()
//     const parentPromises = Array.from(studentIds).map(id => userServiceClient.getParentsByStudentId(id).catch(() => []))
//     const parentResults = await Promise.all(parentPromises)
//     parentResults.flat().forEach(pid => parentIds.add(pid))

//     const result = await prisma.$transaction(async (tx) => {
//       const message = await tx.message.create({
//         data: {
//           senderId: dto.senderId,
//           senderName: `${senderInfo.profile.firstName} ${senderInfo.profile.lastName}`,
//           senderEmail: senderInfo.email,
//           subject: dto.subject,
//           body: dto.body,
//           type: dto.type,
//         }
//       })

//       const allTargets = [
//         ...dto.targets.map(t => ({ messageId: message.id, ...t })),
//         ...(dto.ccTargets || []).map(t => ({ messageId: message.id, ...t })),
//         ...(dto.bccTargets || []).map(t => ({ messageId: message.id, ...t })),
//       ]
//       if (allTargets.length > 0) {
//         await tx.messageTarget.createMany({ data: allTargets })
//       }

//       const participants: any[] = []
//       const processedIds = new Set<string>()

//       const addParticipant = (uid: string, type: RecipientType, folder: FolderType) => {
//         if (!processedIds.has(uid) && uid !== dto.senderId) {
//           participants.push({
//             messageId: message.id,
//             userId: uid,
//             recipientType: type,
//             folder: folder
//           })
//           processedIds.add(uid)
//         }
//       }

//       participants.push({
//         messageId: message.id,
//         userId: dto.senderId,
//         recipientType: RecipientType.SENDER,
//         folder: FolderType.SENT,
//         readAt: new Date()
//       })

//       toUserIds.forEach(id => addParticipant(id, RecipientType.TO, FolderType.INBOX))
//       ccUserIds.forEach(id => addParticipant(id, RecipientType.CC, FolderType.INBOX))
//       bccUserIds.forEach(id => addParticipant(id, RecipientType.BCC, FolderType.INBOX))
//       parentIds.forEach(id => addParticipant(id, RecipientType.BCC, FolderType.INBOX))

//       if (participants.length > 0) {
//         await tx.messageParticipant.createMany({ data: participants })
//       }

//       if (uploadedAttachments.length > 0) {
//         await tx.attachment.createMany({
//           data: uploadedAttachments.map(att => ({
//             messageId: message.id,
//             filename: att.filename,
//             url: att.url,
//             mimeType: att.mimeType,
//             size: att.size,
//             cloudinaryId: att.cloudinaryId,
//           }))
//         })
//       }

//       return {
//         messageId: message.id,
//         recipientCount: participants.length - 1,
//         attachmentCount: uploadedAttachments.length
//       }
//     }, { maxWait: 5000, timeout: 10000 })

//     return result
//   }

//   async saveDraft(dto: SaveDraftDTO) {
//     const message = await messageRepository.saveDraft({
//       senderId: dto.senderId,
//       subject: dto.subject || 'Untitled',
//       body: dto.body || '',
//       type: dto.type || MessageType.GENERAL,
//     })
//     if (dto.targets && dto.targets.length > 0) {
//       await targetRepository.createTargets(
//         dto.targets.map((t) => ({ messageId: message.id, ...t }))
//       )
//     }
//     return { messageId: message.id }
//   }

//   async updateDraft(messageId: string, userId: string, data: Partial<SaveDraftDTO>) {
//     const message = await messageRepository.getMessageById(messageId)
//     if (!message) throw new NotFoundError('Draft')
//     const isDraft = message.participants.some((p) => p.userId === userId && p.folder === FolderType.DRAFT)
//     if (!isDraft) throw new ForbiddenError('Not a draft or access denied')
//     return messageRepository.updateMessage(messageId, data as any)
//   }

//   // ✅ FIXED: Transform data before returning
//   async getInbox(userId: string, page = 1, limit = 20) {
//     const result = await messageRepository.getMessagesByFolder(userId, FolderType.INBOX, page, limit)
    
//     return {
//       messages: result.messages.map(p => this.transformMessage(p)),
//       total: result.total,
//       page: result.page,
//       totalPages: result.totalPages,
//     }
//   }

//   async getSentMessages(userId: string, page = 1, limit = 20) {
//     const result = await messageRepository.getMessagesByFolder(userId, FolderType.SENT, page, limit)
    
//     return {
//       messages: result.messages.map(p => this.transformMessage(p)),
//       total: result.total,
//       page: result.page,
//       totalPages: result.totalPages,
//     }
//   }

//   async getDrafts(userId: string, page = 1, limit = 20) {
//     const result = await messageRepository.getMessagesByFolder(userId, FolderType.DRAFT, page, limit)
    
//     return {
//       messages: result.messages.map(p => this.transformMessage(p)),
//       total: result.total,
//       page: result.page,
//       totalPages: result.totalPages,
//     }
//   }

//   async getTrash(userId: string, page = 1, limit = 20) {
//     const result = await messageRepository.getMessagesByFolder(userId, FolderType.TRASH, page, limit)
    
//     return {
//       messages: result.messages.map(p => this.transformMessage(p)),
//       total: result.total,
//       page: result.page,
//       totalPages: result.totalPages,
//     }
//   }

//   async getArchive(userId: string, page = 1, limit = 20) {
//     const result = await messageRepository.getMessagesByFolder(userId, FolderType.ARCHIVE, page, limit)
    
//     return {
//       messages: result.messages.map(p => this.transformMessage(p)),
//       total: result.total,
//       page: result.page,
//       totalPages: result.totalPages,
//     }
//   }

//   async getMessageById(messageId: string, userId: string) {
//     const message = await messageRepository.getMessageById(messageId)
//     if (!message) throw new NotFoundError('Message')
//     const hasAccess = message.participants.some((p) => p.userId === userId)
//     if (!hasAccess) throw new ForbiddenError('Access denied')
    
//     const userParticipant = message.participants.find((p) => p.userId === userId)
//     if (userParticipant?.recipientType === RecipientType.BCC) {
//       message.participants = message.participants.filter((p) => p.recipientType === RecipientType.TO || p.userId === userId)
//     } else if (userParticipant?.recipientType !== RecipientType.SENDER) {
//       message.participants = message.participants.filter((p) => p.recipientType !== RecipientType.BCC || p.userId === userId)
//     }
//     return message
//   }

//   async markAsRead(messageId: string, userId: string, metadata?: { ipAddress?: string; userAgent?: string }) {
//     await messageRepository.markAsRead(messageId, userId)
//     await readReceiptRepository.createReadReceipt({
//       messageId,
//       userId,
//       ipAddress: metadata?.ipAddress,
//       userAgent: metadata?.userAgent,
//     })
//     return { success: true }
//   }

//   async moveToTrash(messageId: string, userId: string) {
//     return messageRepository.softDelete(messageId, userId)
//   }

//   async moveToArchive(messageId: string, userId: string) {
//     return messageRepository.moveToFolder(messageId, userId, FolderType.ARCHIVE)
//   }

//   async permanentDelete(messageId: string, userId: string) {
//     const message = await messageRepository.getMessageById(messageId)
//     if (message && message.attachments.length > 0) {
//       await cloudinaryService.deleteMultiple(message.attachments.map((a) => a.cloudinaryId))
//     }
//     return messageRepository.permanentDelete(messageId, userId)
//   }

//   async toggleFlag(messageId: string, userId: string) {
//     return messageRepository.toggleFlag(messageId, userId)
//   }

//   async getUnreadCount(userId: string) {
//     return messageRepository.getUnreadCount(userId)
//   }

//   // ✅ FIXED: Transform search results
//   async searchMessages(userId: string, query: string, page = 1, limit = 20) {
//     if (!query?.trim()) throw new ValidationError('Search query is required')
//     const result = await messageRepository.searchMessages(userId, query.trim(), page, limit)
    
//     return {
//       messages: result.messages.map(p => this.transformMessage(p)),
//       total: result.total,
//       page: result.page,
//       totalPages: result.totalPages,
//     }
//   }

//   async replyToMessage(originalMessageId: string, replyDto: { senderId: string; body: string; replyToAll?: boolean; attachments?: Express.Multer.File[] }) {
//     const originalMessage = await messageRepository.getMessageById(originalMessageId)
//     if (!originalMessage) throw new NotFoundError('Original message')
//     const hasAccess = originalMessage.participants.some((p) => p.userId === replyDto.senderId)
//     if (!hasAccess) throw new ForbiddenError('Cannot reply to message you do not have access to')

//     const senderInfo = await userServiceClient.getUserById(replyDto.senderId)
//     const senderName = `${senderInfo.profile.firstName} ${senderInfo.profile.lastName}`
//     const senderEmail = senderInfo.email

//     let recipientIds: string[] = []
//     if (replyDto.replyToAll) {
//       recipientIds = originalMessage.participants
//         .filter((p) => p.recipientType !== RecipientType.BCC && p.userId !== replyDto.senderId)
//         .map((p) => p.userId)
//     } else {
//       recipientIds = [originalMessage.senderId]
//     }
//     recipientIds = [...new Set(recipientIds)]
//     if (recipientIds.length === 0) throw new ValidationError('No valid recipients for reply')

//     let uploadedAttachments: any[] = []
//     if (replyDto.attachments && replyDto.attachments.length > 0) {
//       uploadedAttachments = await cloudinaryService.uploadMultiple(replyDto.attachments)
//     }

//     const threadId = originalMessage.threadId || originalMessage.id
//     const subject = originalMessage.subject.startsWith('Re: ') ? originalMessage.subject : `Re: ${originalMessage.subject}`

//     const replyMessage = await messageRepository.createMessage({
//       senderId: replyDto.senderId,
//       senderName,
//       senderEmail,
//       subject,
//       body: replyDto.body,
//       type: originalMessage.type,
//       threadId,
//     })

//     const participants: any[] = []
//     participants.push({
//       messageId: replyMessage.id,
//       userId: replyDto.senderId,
//       recipientType: RecipientType.SENDER,
//       folder: FolderType.SENT,
//     })
//     recipientIds.forEach((recipientId) => {
//       participants.push({
//         messageId: replyMessage.id,
//         userId: recipientId,
//         recipientType: RecipientType.TO,
//         folder: FolderType.INBOX,
//       })
//     })

//     await messageRepository.createParticipants(participants)

//     if (uploadedAttachments.length > 0) {
//       await messageRepository.createAttachments(
//         uploadedAttachments.map((att) => ({
//           messageId: replyMessage.id,
//           filename: att.filename,
//           url: att.url,
//           mimeType: att.mimeType,
//           size: att.size,
//           cloudinaryId: att.cloudinaryId,
//         }))
//       )
//     }

//     return {
//       messageId: replyMessage.id,
//       threadId,
//       recipientCount: recipientIds.length,
//       attachmentCount: uploadedAttachments.length,
//     }
//   }

//   async getReadReceipts(messageId: string, requesterId: string) {
//     const message = await messageRepository.getMessageById(messageId)
//     if (!message) throw new NotFoundError('Message')
//     if (message.senderId !== requesterId) throw new ForbiddenError('Only sender can view read receipts')
//     const receipts = await readReceiptRepository.getReadReceiptsByMessageId(messageId)
//     const totalRecipients = message.participants.filter((p) => p.recipientType !== RecipientType.SENDER).length
//     const receiptsWithUserInfo = await Promise.all(
//       receipts.map(async (receipt: any) => {
//         try {
//           const userInfo = await userServiceClient.getUserById(receipt.userId)
//           return {
//             userId: receipt.userId,
//             userName: `${userInfo.profile.firstName} ${userInfo.profile.lastName}`,
//             userEmail: userInfo.email,
//             readAt: receipt.readAt,
//           }
//         } catch (error) {
//           return {
//             userId: receipt.userId,
//             userName: 'Unknown User',
//             userEmail: '',
//             readAt: receipt.readAt,
//           }
//         }
//       })
//     )
//     return {
//       messageId,
//       totalRecipients,
//       readCount: receipts.length,
//       unreadCount: totalRecipients - receipts.length,
//       readBy: receiptsWithUserInfo,
//     }
//   }
// }

// export const messageService = new MessageService()
