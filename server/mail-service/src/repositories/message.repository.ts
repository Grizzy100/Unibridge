
// // server/mail-service/src/repositories/message.repository.ts
// import { prisma } from '../utils/prisma.js'
// import { MessageType, FolderType, RecipientType } from '../generated/prisma/client.js'

// export interface CreateMessageDTO {
//   senderId: string
//   senderName?: string
//   senderEmail?: string
//   subject: string
//   body: string
//   type: MessageType
//   threadId?: string
// }

// export interface CreateParticipantDTO {
//   messageId: string
//   userId: string
//   recipientType?: RecipientType
//   folder: FolderType
// }

// export interface CreateAttachmentDTO {
//   messageId: string
//   filename: string
//   url: string
//   mimeType: string
//   size: number
//   cloudinaryId: string
// }

// class MessageRepository {
//   async createMessage(dto: CreateMessageDTO) {
//     return prisma.message.create({
//       data: dto,
//     })
//   }

//   async saveDraft(dto: CreateMessageDTO) {
//     const message = await prisma.message.create({
//       data: dto,
//     })

//     await prisma.messageParticipant.create({
//       data: {
//         messageId: message.id,
//         userId: dto.senderId,
//         recipientType: RecipientType.SENDER,
//         folder: FolderType.DRAFT,
//       },
//     })

//     return message
//   }

//   async updateMessage(messageId: string, data: Partial<CreateMessageDTO>) {
//     return prisma.message.update({
//       where: { id: messageId },
//       data,
//     })
//   }

//   async getMessageById(messageId: string) {
//     return prisma.message.findUnique({
//       where: { id: messageId },
//       include: {
//         participants: true,
//         attachments: true,
//         targets: true,
//       },
//     })
//   }

//   // async getMessagesByFolder(userId: string, folder: FolderType, page = 1, limit = 20) {
//   //   const skip = (page - 1) * limit

//   //   const messages = await prisma.messageParticipant.findMany({
//   //     where: {
//   //       userId,
//   //       folder,
//   //       deletedAt: null,
//   //     },
//   //     include: {
//   //       message: {
//   //         include: {
//   //           attachments: true,
//   //           participants: true,
//   //           targets: true,
//   //         },
//   //       },
//   //     },
//   //     orderBy: {
//   //       message: {
//   //         createdAt: 'desc',
//   //       },
//   //     },
//   //     skip,
//   //     take: limit,
//   //   })

//   //   const total = await prisma.messageParticipant.count({
//   //     where: {
//   //       userId,
//   //       folder,
//   //       deletedAt: null,
//   //     },
//   //   })

//   //   return {
//   //     messages,
//   //     total,
//   //     page,
//   //     totalPages: Math.ceil(total / limit),
//   //   }
//   // }


//   //NEW ARCHIVE code
//   async getMessagesByFolder(userId: string, folder: FolderType, page = 1, limit = 20) {
//   const skip = (page - 1) * limit

//   console.log(`🔍 [Repository] Querying folder:`, { 
//     userId, 
//     folder, 
//     folderType: typeof folder,
//     folderValue: folder 
//   })

//   const messages = await prisma.messageParticipant.findMany({
//     where: {
//       userId,
//       folder,
//       deletedAt: null,
//     },
//     include: {
//       message: {
//         include: {
//           attachments: true,
//           participants: true,
//           targets: true,
//         },
//       },
//     },
//     orderBy: {
//       message: {
//         createdAt: 'desc',
//       },
//     },
//     skip,
//     take: limit,
//   })

//   console.log(`✅ [Repository] Found ${messages.length} messages in folder ${folder}`)

//   const total = await prisma.messageParticipant.count({
//     where: {
//       userId,
//       folder,
//       deletedAt: null,
//     },
//   })

//   return {
//     messages,
//     total,
//     page,
//     totalPages: Math.ceil(total / limit),
//   }
// }

//   async createParticipants(participants: CreateParticipantDTO[]) {
//     return prisma.messageParticipant.createMany({
//       data: participants,
//     })
//   }

//   async createAttachments(attachments: CreateAttachmentDTO[]) {
//     return prisma.attachment.createMany({
//       data: attachments,
//     })
//   }

//   async markAsRead(messageId: string, userId: string) {
//     return prisma.messageParticipant.updateMany({
//       where: {
//         messageId,
//         userId,
//       },
//       data: {
//         readAt: new Date(),
//       },
//     })
//   }

//   async softDelete(messageId: string, userId: string) {
//     return prisma.messageParticipant.updateMany({
//       where: {
//         messageId,
//         userId,
//       },
//       data: {
//         folder: FolderType.TRASH,
//         deletedAt: new Date(),
//       },
//     })
//   }

//   async moveToFolder(messageId: string, userId: string, folder: FolderType) {
//     return prisma.messageParticipant.updateMany({
//       where: {
//         messageId,
//         userId,
//       },
//       data: {
//         folder,
//         archivedAt: folder === FolderType.ARCHIVE ? new Date() : null,
//       },
//     })
//   }

//   async permanentDelete(messageId: string, userId: string) {
//     const participant = await prisma.messageParticipant.findFirst({
//       where: {
//         messageId,
//         userId,
//       },
//     })

//     if (!participant) return null

//     await prisma.messageParticipant.delete({
//       where: {
//         id: participant.id,
//       },
//     })

//     const remainingParticipants = await prisma.messageParticipant.count({
//       where: { messageId },
//     })

//     if (remainingParticipants === 0) {
//       await prisma.message.delete({
//         where: { id: messageId },
//       })
//     }

//     return { deleted: true }
//   }

//   async toggleFlag(messageId: string, userId: string) {
//     const participant = await prisma.messageParticipant.findFirst({
//       where: {
//         messageId,
//         userId,
//       },
//     })

//     if (!participant) return null

//     return prisma.messageParticipant.update({
//       where: {
//         id: participant.id,
//       },
//       data: {
//         flagged: !participant.flagged,
//       },
//     })
//   }

//   async getUnreadCount(userId: string) {
//     return prisma.messageParticipant.count({
//       where: {
//         userId,
//         readAt: null,
//         folder: FolderType.INBOX,
//         deletedAt: null,
//       },
//     })
//   }

//   // ✅ NEW: Search messages
//   async searchMessages(userId: string, query: string, page = 1, limit = 20) {
//     const skip = (page - 1) * limit
    
//     // Build search conditions
//     const searchConditions: any = {
//       userId,
//       deletedAt: null,
//       message: {
//         OR: [
//           { subject: { contains: query, mode: 'insensitive' } },
//           { body: { contains: query, mode: 'insensitive' } },
//           { senderName: { contains: query, mode: 'insensitive' } },
//           { senderEmail: { contains: query, mode: 'insensitive' } },
//         ],
//       },
//     }

//     // Try to match message type enum
//     const upperQuery = query.toUpperCase()
//     const validTypes = [
//       'GENERAL', 'NOTICE', 'ASSIGNMENT', 'ATTENDANCE', 'OUTPASS', 
//       'DISCIPLINE', 'FEE', 'HOSTEL', 'MESS', 'SPORTS', 'PLACEMENT', 
//       'INTERNSHIP', 'EVENT', 'WORKSHOP', 'SEMINAR', 'MAINTENANCE', 
//       'ANNOUNCEMENT'
//     ]
    
//     if (validTypes.includes(upperQuery)) {
//       searchConditions.message.OR.push({ type: upperQuery as MessageType })
//     }

//     const messages = await prisma.messageParticipant.findMany({
//       where: searchConditions,
//       include: {
//         message: {
//           include: {
//             attachments: true,
//             participants: true,
//             targets: true,
//           },
//         },
//       },
//       orderBy: { message: { createdAt: 'desc' } },
//       skip,
//       take: limit,
//     })

//     const total = await prisma.messageParticipant.count({
//       where: searchConditions,
//     })

//     return { 
//       messages, 
//       total, 
//       page, 
//       totalPages: Math.ceil(total / limit) 
//     }
//   }
// }

// export const messageRepository = new MessageRepository()







// server/mail-service/src/repositories/message.repository.ts
import { prisma } from '../utils/prisma.js'
import { MessageType, FolderType, RecipientType } from '../generated/prisma/client.js'

export interface CreateMessageDTO {
  senderId: string
  senderName?: string
  senderEmail?: string
  subject: string
  body: string
  type: MessageType
  threadId?: string
}

export interface CreateParticipantDTO {
  messageId: string
  userId: string
  recipientType?: RecipientType
  folder: FolderType
}

export interface CreateAttachmentDTO {
  messageId: string
  filename: string
  url: string
  mimeType: string
  size: number
  cloudinaryId: string
}

class MessageRepository {
  async createMessage(dto: CreateMessageDTO) {
    return prisma.message.create({
      data: dto,
    })
  }

  async saveDraft(dto: CreateMessageDTO) {
    const message = await prisma.message.create({
      data: dto,
    })

    await prisma.messageParticipant.create({
      data: {
        messageId: message.id,
        userId: dto.senderId,
        recipientType: RecipientType.SENDER,
        folder: FolderType.DRAFT,
      },
    })

    return message
  }

  async updateMessage(messageId: string, data: Partial<CreateMessageDTO>) {
    return prisma.message.update({
      where: { id: messageId },
      data,
    })
  }

  async getMessageById(messageId: string) {
    return prisma.message.findUnique({
      where: { id: messageId },
      include: {
        participants: true,
        attachments: true,
        targets: true,
      },
    })
  }


  //-------------------------------------------------------------------------------------------------
  async getMessagesByFolder(userId: string, folder: FolderType, page = 1, limit = 20) {
  const skip = (page - 1) * limit

  console.log(`🔍 [Repository] Querying folder:`, { 
    userId, 
    folder, 
    folderType: typeof folder,
    folderValue: folder 
  })

  const messages = await prisma.messageParticipant.findMany({
    where: {
      userId,
      folder,
      // ✅ REMOVE THIS LINE - it was preventing archived/trashed items from showing
      // deletedAt: null,  ❌ DELETE THIS
    },
    include: {
      message: {
        include: {
          attachments: true,
          participants: true,
          targets: true,
        },
      },
    },
    orderBy: {
      message: {
        createdAt: 'desc',
      },
    },
    skip,
    take: limit,
  })

  console.log(`✅ [Repository] Found ${messages.length} messages in folder ${folder}`)

  const total = await prisma.messageParticipant.count({
    where: {
      userId,
      folder,
      // ✅ REMOVE THIS HERE TOO
      // deletedAt: null,  ❌ DELETE THIS
    },
  })

  return {
    messages,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  }
}
//---------------------------------------------------------




  async createParticipants(participants: CreateParticipantDTO[]) {
    return prisma.messageParticipant.createMany({
      data: participants,
    })
  }

  async createAttachments(attachments: CreateAttachmentDTO[]) {
    return prisma.attachment.createMany({
      data: attachments,
    })
  }

  async markAsRead(messageId: string, userId: string) {
    return prisma.messageParticipant.updateMany({
      where: {
        messageId,
        userId,
      },
      data: {
        readAt: new Date(),
      },
    })
  }

  // ✅ FIXED: Soft delete sets deletedAt
  async softDelete(messageId: string, userId: string) {
    console.log(`🗑️ [Repository] softDelete:`, { messageId, userId })
    
    const result = await prisma.messageParticipant.updateMany({
      where: {
        messageId,
        userId,
      },
      data: {
        folder: FolderType.TRASH,
        deletedAt: new Date(), // ✅ Mark as deleted
        archivedAt: null,      // ✅ Clear archivedAt
      },
    })

    console.log(`✅ [Repository] Soft deleted ${result.count} records`)
    return result
  }

  // ✅ FIXED: Clear deletedAt when moving to non-trash folders
  async moveToFolder(messageId: string, userId: string, folder: FolderType) {
  console.log(`[Repository] moveToFolder:`, { messageId, userId, folder })
  
  const result = await prisma.messageParticipant.updateMany({
    where: {
      messageId,
      userId,
    },
    data: {
      folder,
      // ✅ FIX: Only set deletedAt for TRASH, not ARCHIVE
      deletedAt: folder === FolderType.TRASH ? new Date() : null, 
      archivedAt: folder === FolderType.ARCHIVE ? new Date() : null,
    },
  })

  console.log(`[Repository] Moved ${result.count} records to ${folder}`)
  return result
}



  async permanentDelete(messageId: string, userId: string) {
    const participant = await prisma.messageParticipant.findFirst({
      where: {
        messageId,
        userId,
      },
    })

    if (!participant) return null

    await prisma.messageParticipant.delete({
      where: {
        id: participant.id,
      },
    })

    const remainingParticipants = await prisma.messageParticipant.count({
      where: { messageId },
    })

    if (remainingParticipants === 0) {
      await prisma.message.delete({
        where: { id: messageId },
      })
    }

    return { deleted: true }
  }

  async toggleFlag(messageId: string, userId: string) {
    const participant = await prisma.messageParticipant.findFirst({
      where: {
        messageId,
        userId,
      },
    })

    if (!participant) return null

    return prisma.messageParticipant.update({
      where: {
        id: participant.id,
      },
      data: {
        flagged: !participant.flagged,
      },
    })
  }

  async getUnreadCount(userId: string) {
    return prisma.messageParticipant.count({
      where: {
        userId,
        readAt: null,
        folder: FolderType.INBOX,
        deletedAt: null,
      },
    })
  }

  async searchMessages(userId: string, query: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit
    
    const searchConditions: any = {
      userId,
      deletedAt: null,
      message: {
        OR: [
          { subject: { contains: query, mode: 'insensitive' } },
          { body: { contains: query, mode: 'insensitive' } },
          { senderName: { contains: query, mode: 'insensitive' } },
          { senderEmail: { contains: query, mode: 'insensitive' } },
        ],
      },
    }

    const upperQuery = query.toUpperCase()
    const validTypes = [
      'GENERAL', 'NOTICE', 'ASSIGNMENT', 'ATTENDANCE', 'OUTPASS', 
      'DISCIPLINE', 'FEE', 'HOSTEL', 'MESS', 'SPORTS', 'PLACEMENT', 
      'INTERNSHIP', 'EVENT', 'WORKSHOP', 'SEMINAR', 'MAINTENANCE', 
      'ANNOUNCEMENT'
    ]
    
    if (validTypes.includes(upperQuery)) {
      searchConditions.message.OR.push({ type: upperQuery as MessageType })
    }

    const messages = await prisma.messageParticipant.findMany({
      where: searchConditions,
      include: {
        message: {
          include: {
            attachments: true,
            participants: true,
            targets: true,
          },
        },
      },
      orderBy: { message: { createdAt: 'desc' } },
      skip,
      take: limit,
    })

    const total = await prisma.messageParticipant.count({
      where: searchConditions,
    })

    return { 
      messages, 
      total, 
      page, 
      totalPages: Math.ceil(total / limit) 
    }
  }
}

export const messageRepository = new MessageRepository()
