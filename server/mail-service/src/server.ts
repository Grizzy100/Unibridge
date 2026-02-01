
//server/mail-service/src/server.ts
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { config, validateConfig } from './config/index.js'
import { prisma } from './utils/prisma.js'
import routes from './routes/index.js'
import { errorHandler } from './middleware/error-handler.middleware.js'
const app = express()
// Middleware
app.use(
  cors({
    origin: config.services.clientUrl,
    credentials: true,
  })
)
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))
// Request logging in development
if (config.server.isDev) {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`)
    next()
  })
}
// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'mail-service',
    port: config.server.port,
    env: config.server.env,
    timestamp: new Date().toISOString(),
  })
})
// API Routes
app.use('/api/mail', routes)
// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.path,
  })
})
// Error Handler (must be last)
app.use(errorHandler)
// Start Server
async function startServer() {
  try {
    // Validate configuration
    validateConfig()
    // Test database connection
    await prisma.$connect()
    console.log('Database connected successfully')
    // Start listening
    app.listen(config.server.port, () => {
      console.log(
        `Mail service running on port ${config.server.port} in ${config.server.env} mode`
      )
    })
  } catch (error: any) {
    console.error('Failed to start server:', error.message)
    process.exit(1)
  }
}
startServer()
