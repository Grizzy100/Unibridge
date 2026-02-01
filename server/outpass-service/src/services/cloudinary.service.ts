
//server/outpass-service/src/services/cloudinary.service.ts
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});
export async function uploadProofDocument(file: Express.Multer.File) {
  try {
    const resourceType = file.mimetype.includes('pdf') ? 'raw' : 'image';
    const result = await cloudinary.uploader.upload(file.path, {
      folder: 'outpass-proofs',
      resource_type: resourceType,
      allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
      transformation: resourceType === 'image' ? [{ width: 1000, height: 1000, crop: 'limit' }, { quality: 'auto:good' }, { fetch_format: 'auto' }] : undefined
    });
    if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
    return { url: result.secure_url, publicId: result.public_id };
  } catch (error: any) {
    if (file.path && fs.existsSync(file.path)) fs.unlinkSync(file.path);
    throw new Error('Failed to upload proof document: ' + error.message);
  }
}
export async function deleteProofDocument(publicId: string, resourceType: string = 'image') {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType as any });
    console.log('Deleted proof document:', publicId);
  } catch (error: any) {
    console.error('Cloudinary delete error:', error);
  }
}
