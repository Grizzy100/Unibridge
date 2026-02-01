//server/mail-service/src/config/index.ts
import "dotenv/config"

const getEnv = (key: string, required = true): string => {
  const value = process.env[key]
  if (required && !value) {
    throw new Error(`Missing env variable: ${key}`)
  }
  return value || ""
}

export const config = {
  server: {
    port: parseInt(getEnv("PORT", false)) || 3006,
    env: getEnv("NODE_ENV", false) || "development",
    isDev: (getEnv("NODE_ENV", false) || "development") === "development"
  },
  database: {
    url: getEnv("DATABASE_URL")
  },
  jwt: {
    secret: getEnv("JWT_SECRET")
  },
  services: {
    userServiceUrl: getEnv("USER_SERVICE_URL"),
    userServiceKey: getEnv("USER_SERVICE_KEY"),
    clientUrl: getEnv("CLIENT_URL", false)
  },
  cloudinary: {
    cloudName: getEnv("CLOUDINARY_CLOUD_NAME"),
    apiKey: getEnv("CLOUDINARY_API_KEY"),
    apiSecret: getEnv("CLOUDINARY_API_SECRET")
  },
  upload: {
    maxFileSizeMB: parseInt(getEnv("MAX_FILE_SIZE_MB", false)) || 10,
    maxFiles: parseInt(getEnv("MAX_FILES_PER_MESSAGE", false)) || 10,
    maxFileSizeBytes: (parseInt(getEnv("MAX_FILE_SIZE_MB", false)) || 10) * 1024 * 1024
  }
} as const

export const validateConfig = () => {
  const required = ["DATABASE_URL", "JWT_SECRET", "USER_SERVICE_URL", "USER_SERVICE_KEY"]
  const missing = required.filter((key) => !process.env[key])
  if (missing.length > 0) {
    throw new Error(`Missing env variables: ${missing.join(", ")}`)
  }
  console.log("✅ Configuration validated")
}













