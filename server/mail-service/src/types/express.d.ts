
//server/mail-service/src/types/express.d.ts
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string
        email: string
        role: string
      }
    }
  }
}
export {}
