
//server/task-service/src/services/cloudinary.service.ts
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
export async function uploadTaskFile(file: Express.Multer.File) {
  const resourceType = file.mimetype.startsWith('image') ? 'image' : 'raw';
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      resource_type: resourceType,
      folder: 'unibridge/tasks',
    });
    return {
      url: result.secure_url,
      publicId: result.public_id,
      mimeType: file.mimetype,
    };
  } finally {
    fs.unlink(file.path, () => {});
  }
}
