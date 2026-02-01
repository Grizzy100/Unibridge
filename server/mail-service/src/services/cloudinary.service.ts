
// server/mail-service/src/services/cloudinary.service.ts
import { v2 as cloudinary } from 'cloudinary'
import { config } from '../config/index.js'
import { Readable } from 'stream'
cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
})
export interface UploadResult {
  cloudinaryId: string
  url: string
  filename: string
  mimeType: string
  size: number
}
class CloudinaryService {
  private readonly FOLDER = 'unibridge/mail-attachments'
  async uploadFile(
    buffer: Buffer,
    originalName: string,
    mimeType: string
  ): Promise<UploadResult> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: this.FOLDER,
          resource_type: 'auto',
          public_id: `${Date.now()}_${originalName}`,
        },
        (error, result) => {
          if (error || !result) {
            reject(error || new Error('Upload failed'))
            return
          }
          resolve({
            cloudinaryId: result.public_id,
            url: result.secure_url,
            filename: originalName,
            mimeType,
            size: result.bytes,
          })
        }
      )
      Readable.from(buffer).pipe(uploadStream)
    })
  }
  async uploadMultiple(
    files: Array<{ buffer: Buffer; originalname: string; mimetype: string }>
  ): Promise<UploadResult[]> {
    return Promise.all(
      files.map((file) =>
        this.uploadFile(file.buffer, file.originalname, file.mimetype)
      )
    )
  }
  async deleteFile(cloudinaryId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(cloudinaryId)
    } catch (error) {
      console.error('Failed to delete from Cloudinary:', error)
    }
  }
  async deleteMultiple(cloudinaryIds: string[]): Promise<void> {
    await Promise.allSettled(cloudinaryIds.map((id) => this.deleteFile(id)))
  }
}
export const cloudinaryService = new CloudinaryService()
