import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL ?? 'redis://localhost:6379';

export const redis = new Redis(redisUrl, {
  lazyConnect: false,
  enableOfflineQueue: true,
  maxRetriesPerRequest: 1,
  connectTimeout: 2000,
});

redis.on('connect', () => {
  console.log('[chat redis] connected');
});

redis.on('error', (error) => {
  console.warn('[chat redis] connection error:', error);
});