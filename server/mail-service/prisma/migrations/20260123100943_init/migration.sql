-- AlterEnum
ALTER TYPE "TargetKind" ADD VALUE 'EMAIL';

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "senderName" TEXT;
