-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "isConfidential" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "MessageParticipant" ADD COLUMN     "isDirectRecipient" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isMirrored" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "mirroredFromUserId" TEXT;

-- CreateIndex
CREATE INDEX "MessageParticipant_userId_isMirrored_idx" ON "MessageParticipant"("userId", "isMirrored");
