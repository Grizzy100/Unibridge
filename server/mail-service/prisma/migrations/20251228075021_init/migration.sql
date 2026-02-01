-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('GENERAL', 'NOTICE', 'ASSIGNMENT', 'ATTENDANCE', 'OUTPASS', 'DISCIPLINE', 'FEE', 'HOSTEL', 'MESS', 'SPORTS', 'PLACEMENT', 'INTERNSHIP', 'EVENT', 'WORKSHOP', 'SEMINAR', 'MAINTENANCE', 'ANNOUNCEMENT');

-- CreateEnum
CREATE TYPE "FolderType" AS ENUM ('INBOX', 'SENT', 'DRAFT', 'TRASH', 'ARCHIVE');

-- CreateEnum
CREATE TYPE "TargetKind" AS ENUM ('USER', 'ROLE', 'COURSE', 'BATCH', 'SCHOOL', 'DEPARTMENT', 'YEAR', 'SEMESTER', 'HOSTEL_BLOCK');

-- CreateEnum
CREATE TYPE "RecipientType" AS ENUM ('TO', 'CC', 'BCC', 'SENDER');

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "type" "MessageType" NOT NULL DEFAULT 'GENERAL',
    "threadId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MessageParticipant" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "recipientType" "RecipientType",
    "folder" "FolderType" NOT NULL DEFAULT 'INBOX',
    "readAt" TIMESTAMP(3),
    "flagged" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MessageParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MessageTarget" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "kind" "TargetKind" NOT NULL,
    "value" TEXT NOT NULL,
    "resolvedCount" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MessageTarget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attachment" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "cloudinaryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Attachment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Message_senderId_idx" ON "Message"("senderId");

-- CreateIndex
CREATE INDEX "Message_threadId_idx" ON "Message"("threadId");

-- CreateIndex
CREATE INDEX "Message_type_idx" ON "Message"("type");

-- CreateIndex
CREATE INDEX "Message_createdAt_idx" ON "Message"("createdAt");

-- CreateIndex
CREATE INDEX "MessageParticipant_userId_folder_idx" ON "MessageParticipant"("userId", "folder");

-- CreateIndex
CREATE INDEX "MessageParticipant_userId_flagged_idx" ON "MessageParticipant"("userId", "flagged");

-- CreateIndex
CREATE INDEX "MessageParticipant_readAt_idx" ON "MessageParticipant"("readAt");

-- CreateIndex
CREATE INDEX "MessageParticipant_deletedAt_idx" ON "MessageParticipant"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "MessageParticipant_messageId_userId_key" ON "MessageParticipant"("messageId", "userId");

-- CreateIndex
CREATE INDEX "MessageTarget_messageId_idx" ON "MessageTarget"("messageId");

-- CreateIndex
CREATE INDEX "MessageTarget_kind_value_idx" ON "MessageTarget"("kind", "value");

-- CreateIndex
CREATE UNIQUE INDEX "Attachment_cloudinaryId_key" ON "Attachment"("cloudinaryId");

-- CreateIndex
CREATE INDEX "Attachment_messageId_idx" ON "Attachment"("messageId");

-- AddForeignKey
ALTER TABLE "MessageParticipant" ADD CONSTRAINT "MessageParticipant_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageTarget" ADD CONSTRAINT "MessageTarget_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;
