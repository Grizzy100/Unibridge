
// // server/mail-service/src/routes/index.ts
// import { Router } from 'express'
// import { mailController } from '../controllers/mail.controller.js'
// import { authMiddleware } from '../middleware/auth.middleware.js'
// import { uploadMiddleware } from '../middleware/file-upload.middleware.js'

// const router = Router()

// // Apply authentication to all routes
// router.use(authMiddleware)

// // Send & Draft
// router.post('/send', uploadMiddleware, mailController.sendMessage)
// router.post('/drafts', mailController.saveDraft)
// router.put('/drafts/:messageId', mailController.updateDraft)

// // Folders
// router.get('/inbox', mailController.getInbox)
// router.get('/sent', mailController.getSentMessages)
// router.get('/drafts', mailController.getDrafts)
// router.get('/trash', mailController.getTrash)
// router.get('/archive', mailController.getArchive)

// // ✅ NEW: Search
// router.get('/search', mailController.searchMessages)

// // Unread count
// router.get('/unread-count', mailController.getUnreadCount)

// // Message operations
// router.get('/messages/:messageId', mailController.getMessageById)
// router.patch('/messages/:messageId/read', mailController.markAsRead)
// router.patch('/messages/:messageId/trash', mailController.moveToTrash)
// router.patch('/messages/:messageId/archive', mailController.moveToArchive)
// router.patch('/messages/:messageId/flag', mailController.toggleFlag)
// router.delete('/messages/:messageId', mailController.permanentDelete)

// // ✅ NEW: Reply (with file upload support)
// router.post('/messages/:messageId/reply', uploadMiddleware, mailController.replyToMessage)

// // ✅ NEW: Read receipts
// router.get('/messages/:messageId/read-receipts', mailController.getReadReceipts)

// // Unread count
// router.get('/unread-count', mailController.getUnreadCount)

// export default router




// server/mail-service/src/routes/index.ts
import { Router } from 'express'
import { mailController } from '../controllers/mail.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'
import { uploadMiddleware } from '../middleware/file-upload.middleware.js'

const router = Router()

// Apply authentication to all routes
router.use(authMiddleware)

// Send & Draft
router.post('/send', uploadMiddleware, mailController.sendMessage)
router.post('/drafts', mailController.saveDraft)
router.put('/drafts/:messageId', mailController.updateDraft)

// Folders
router.get('/inbox', mailController.getInbox)
router.get('/sent', mailController.getSentMessages)
router.get('/drafts', mailController.getDrafts)
router.get('/trash', mailController.getTrash)
router.get('/archive', mailController.getArchive)

// Search
router.get('/search', mailController.searchMessages)

// Unread count (BEFORE :messageId routes)
router.get('/unread-count', mailController.getUnreadCount)

// ✅ CRITICAL: Message operations with specific paths MUST come BEFORE generic /messages/:messageId
router.patch('/messages/:messageId/read', mailController.markAsRead)
router.patch('/messages/:messageId/trash', mailController.moveToTrash)
router.patch('/messages/:messageId/archive', mailController.moveToArchive)
router.patch('/messages/:messageId/flag', mailController.toggleFlag)
router.patch('/messages/:messageId/move', mailController.moveMessageToFolder)
router.post('/messages/:messageId/reply', uploadMiddleware, mailController.replyToMessage)
router.get('/messages/:messageId/read-receipts', mailController.getReadReceipts)
router.delete('/messages/:messageId', mailController.permanentDelete)

// ✅ Generic message GET - MUST BE LAST among /messages/* routes
router.get('/messages/:messageId', mailController.getMessageById)

export default router
