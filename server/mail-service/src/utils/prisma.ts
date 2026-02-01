//server\mail-service\src\utils\prisma.ts
import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client';

import { PrismaPg } from '@prisma/adapter-pg';
import pkg from 'pg'
const { Pool } = pkg
const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error(' DATABASE_URL environment variable is not set')
}
const pool = new Pool({
  connectionString,
  max: 10,
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 30000,
})
const adapter = new PrismaPg(pool)
export const prisma = new PrismaClient({
  adapter,
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
})
const gracefulShutdown = async () => {
  console.log('\n Shutting down gracefully...')
  try {
    await prisma.$disconnect()
    await pool.end()
    console.log('Disconnected from database')
  } catch (error) {
    console.error('Error during shutdown:', error)
  }
  process.exit(0)
}
process.on('SIGINT', gracefulShutdown)
process.on('SIGTERM', gracefulShutdown)
