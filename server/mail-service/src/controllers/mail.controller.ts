// server/mail-service/src/controllers/mail.controller.ts
import { Request, Response, NextFunction } from 'express'
import { messageService } from '../services/message.service.js'

class MailController {
  async sendMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId
      
      // Destructure raw body
      let { targets, ccTargets, bccTargets, subject, body, type } = req.body
      const attachments = req.files as Express.Multer.File[] | undefined

      // ✅ FIX: Parse JSON strings from FormData
      // FormData sends arrays/objects as strings. We must parse them back.
      const parseJSON = (data: any) => {
        if (typeof data === 'string') {
          try {
            return JSON.parse(data)
          } catch (e) {
            console.error('Failed to parse JSON field:', data)
            return [] 
          }
        }
        return data
      }

      const cleanTargets = parseJSON(targets)
      const cleanCC = parseJSON(ccTargets)
      const cleanBCC = parseJSON(bccTargets)

      const result = await messageService.sendMessage({
        senderId: userId,
        targets: Array.isArray(cleanTargets) ? cleanTargets : [],
        ccTargets: Array.isArray(cleanCC) ? cleanCC : [],
        bccTargets: Array.isArray(cleanBCC) ? cleanBCC : [],
        subject,
        body,
        type,
        attachments,
      })

      res.status(201).json({ success: true, data: result })
    } catch (error) {
      next(error)
    }
  }

  async saveDraft(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId
      let { subject, body, type, targets } = req.body

      // ✅ FIX: Parse targets here too
      if (typeof targets === 'string') {
        try { targets = JSON.parse(targets) } catch (e) { targets = [] }
      }

      const result = await messageService.saveDraft({
        senderId: userId,
        subject,
        body,
        type,
        targets,
      })

      res.status(201).json({ success: true, data: result })
    } catch (error) {
      next(error)
    }
  }

  // ... (Keep the rest of the methods: updateDraft, getInbox, etc. exactly as they were) ...
  async updateDraft(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId
      const messageId = req.params.messageId
      const data = req.body
      const result = await messageService.updateDraft(messageId, userId, data)
      res.json({ success: true, data: result })
    } catch (error) { next(error) }
  }

  async getInbox(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId
      const page = parseInt(req.query.page as string) || 1
      const limit = parseInt(req.query.limit as string) || 20
      const result = await messageService.getInbox(userId, page, limit)
      res.json({ success: true, data: result })
    } catch (error) { next(error) }
  }

  async getSentMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId
      const page = parseInt(req.query.page as string) || 1
      const limit = parseInt(req.query.limit as string) || 20
      const result = await messageService.getSentMessages(userId, page, limit)
      res.json({ success: true, data: result })
    } catch (error) { next(error) }
  }

  async getDrafts(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId
      const page = parseInt(req.query.page as string) || 1
      const limit = parseInt(req.query.limit as string) || 20
      const result = await messageService.getDrafts(userId, page, limit)
      res.json({ success: true, data: result })
    } catch (error) { next(error) }
  }

  async getTrash(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId
      const page = parseInt(req.query.page as string) || 1
      const limit = parseInt(req.query.limit as string) || 20
      const result = await messageService.getTrash(userId, page, limit)
      res.json({ success: true, data: result })
    } catch (error) { next(error) }
  }

  // async getArchive(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     const userId = req.user!.userId
  //     const page = parseInt(req.query.page as string) || 1
  //     const limit = parseInt(req.query.limit as string) || 20
  //     const result = await messageService.getArchive(userId, page, limit)
  //     res.json({ success: true, data: result })
  //   } catch (error) { next(error) }
  // }



  async getArchive(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId
      const page = Number(req.query.page) || 1
      const limit = Number(req.query.limit) || 20

      console.log(`[Controller] Get archive request:`, { userId, page, limit })

      const result = await messageService.getArchive(userId, page, limit)

      console.log(`[Controller] Archive folder returned ${result.messages.length} messages`)

      res.json({
        success: true,
        data: result,
      })
    } catch (error) {
      console.error(`[Controller] Get archive failed:`, error)
      next(error)
    }
  }

  async getMessageById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId
      const messageId = req.params.messageId
      const result = await messageService.getMessageById(messageId, userId)
      res.json({ success: true, data: result })
    } catch (error) { next(error) }
  }

  async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId
      const messageId = req.params.messageId
      const ipAddress = (req.headers['x-forwarded-for'] as string) || req.ip
      const userAgent = req.headers['user-agent']
      await messageService.markAsRead(messageId, userId, { ipAddress, userAgent })
      res.json({ success: true })
    } catch (error) { next(error) }
  }

  async moveToTrash(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId
      const messageId = req.params.messageId
      await messageService.moveToTrash(messageId, userId)
      res.json({ success: true })
    } catch (error) { next(error) }
  }

  // async moveToArchive(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     const userId = req.user!.userId
  //     const messageId = req.params.messageId
  //     await messageService.moveToArchive(messageId, userId)
  //     res.json({ success: true })
  //   } catch (error) { next(error) }
  // }



  // server/mail-service/src/controllers/mail.controller.ts

  async moveToArchive(req: Request, res: Response, next: NextFunction) {
    try {
      const { messageId } = req.params
      const userId = req.user!.userId

      console.log(`[Controller] Archive request:`, { messageId, userId })

      await messageService.moveToArchive(messageId, userId)

      console.log(`[Controller] Archive successful`)

      res.json({
        success: true,
        data: { message: 'Message archived successfully' },
      })
    } catch (error) {
      console.error(`[Controller] Archive failed:`, error)
      next(error)
    }
  }


    async moveMessageToFolder(req: Request, res: Response, next: NextFunction) {
      try {
        const { messageId } = req.params
        const { folder } = req.body
        const userId = req.user!.userId

        // Validate folder
        const validFolders = ['INBOX', 'SENT', 'DRAFT', 'TRASH', 'ARCHIVE']
        if (!folder || !validFolders.includes(folder.toUpperCase())) {
          return res.status(400).json({
            success: false,
            error: 'Invalid folder. Must be one of: INBOX, SENT, DRAFT, TRASH, ARCHIVE'
          })
        }

        console.log(`[Controller] Moving message ${messageId} to folder: ${folder}`)

        await messageService.moveToFolder(messageId, userId, folder.toUpperCase())

        console.log(`[Controller] Move successful`)

        res.json({
          success: true,
          data: { message: `Message moved to ${folder} successfully` }
        })
      } catch (error) {
        console.error(`[Controller] Move to folder failed:`, error)
        next(error)
      }
    }

  async permanentDelete(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId
      const messageId = req.params.messageId
      await messageService.permanentDelete(messageId, userId)
      res.json({ success: true })
    } catch (error) { next(error) }
  }

  async toggleFlag(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId
      const messageId = req.params.messageId
      const result = await messageService.toggleFlag(messageId, userId)
      res.json({ success: true, data: result })
    } catch (error) { next(error) }
  }

  async getUnreadCount(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId
      const count = await messageService.getUnreadCount(userId)
      res.json({ success: true, data: { unreadCount: count } })
    } catch (error) { next(error) }
  }

  async searchMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId
      const query = req.query.q as string
      const page = parseInt(req.query.page as string) || 1
      const limit = parseInt(req.query.limit as string) || 20
      const result = await messageService.searchMessages(userId, query, page, limit)
      res.json({ success: true, data: result })
    } catch (error) { next(error) }
  }

  async replyToMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId
      const messageId = req.params.messageId
      const { body, replyToAll } = req.body
      const attachments = req.files as Express.Multer.File[] | undefined
      const result = await messageService.replyToMessage(messageId, {
        senderId: userId,
        body,
        replyToAll: replyToAll === true || replyToAll === 'true',
        attachments,
      })
      res.status(201).json({ success: true, data: result })
    } catch (error) { next(error) }
  }

  async getReadReceipts(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId
      const messageId = req.params.messageId
      const result = await messageService.getReadReceipts(messageId, userId)
      res.json({ success: true, data: result })
    } catch (error) { next(error) }
  }
}

export const mailController = new MailController()