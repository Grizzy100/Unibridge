//server/attendance-service/src/utils/qr-generator.ts
import crypto from 'crypto';

export function generateQRCode(data: string): string {
  const hash = crypto.createHash('sha256').update(data).digest('hex');
  return hash;
}

export function validateQRCode(qrCode: string): boolean {
  return /^[a-f0-9]{64}$/i.test(qrCode);
}
