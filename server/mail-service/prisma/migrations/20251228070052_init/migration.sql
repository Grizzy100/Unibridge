-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "email";

-- CreateEnum
CREATE TYPE "email"."MessageType" AS ENUM ('GENERAL', 'NOTICE', 'ASSIGNMENT', 'ATTENDANCE', 'OUTPASS', 'DISCIPLINE', 'FEE', 'HOSTEL', 'MESS', 'SPORTS', 'PLACEMENT', 'INTERNSHIP', 'EVENT', 'WORKSHOP', 'SEMINAR', 'MAINTENANCE', 'ANNOUNCEMENT');

-- CreateEnum
CREATE TYPE "email"."FolderType" AS ENUM ('INBOX', 'SENT', 'DRAFT', 'TRASH', 'ARCHIVE');

-- CreateEnum
CREATE TYPE "email"."TargetKind" AS ENUM ('USER', 'ROLE', 'COURSE', 'BATCH', 'SCHOOL', 'DEPARTMENT', 'YEAR', 'SEMESTER', 'HOSTEL_BLOCK');

-- CreateEnum
CREATE TYPE "email"."RecipientType" AS ENUM ('TO', 'CC', 'BCC', 'SENDER');

-- CreateTable
CREATE TABLE "email"."Message" (
    "id" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "type" "email"."MessageType" NOT NULL DEFAULT 'GENERAL',
    "threadId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email"."MessageParticipant" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "recipientType" "email"."RecipientType",
    "folder" "email"."FolderType" NOT NULL DEFAULT 'INBOX',
    "readAt" TIMESTAMP(3),
    "flagged" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MessageParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email"."MessageTarget" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "kind" "email"."TargetKind" NOT NULL,
    "value" TEXT NOT NULL,
    "resolvedCount" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MessageTarget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email"."Attachment" (
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
CREATE INDEX "Message_senderId_idx" ON "email"."Message"("senderId");

-- CreateIndex
CREATE INDEX "Message_threadId_idx" ON "email"."Message"("threadId");

-- CreateIndex
CREATE INDEX "Message_type_idx" ON "email"."Message"("type");

-- CreateIndex
CREATE INDEX "Message_createdAt_idx" ON "email"."Message"("createdAt");

-- CreateIndex
CREATE INDEX "MessageParticipant_userId_folder_idx" ON "email"."MessageParticipant"("userId", "folder");

-- CreateIndex
CREATE INDEX "MessageParticipant_userId_flagged_idx" ON "email"."MessageParticipant"("userId", "flagged");

-- CreateIndex
CREATE INDEX "MessageParticipant_readAt_idx" ON "email"."MessageParticipant"("readAt");

-- CreateIndex
CREATE INDEX "MessageParticipant_deletedAt_idx" ON "email"."MessageParticipant"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "MessageParticipant_messageId_userId_key" ON "email"."MessageParticipant"("messageId", "userId");

-- CreateIndex
CREATE INDEX "MessageTarget_messageId_idx" ON "email"."MessageTarget"("messageId");

-- CreateIndex
CREATE INDEX "MessageTarget_kind_value_idx" ON "email"."MessageTarget"("kind", "value");

-- CreateIndex
CREATE UNIQUE INDEX "Attachment_cloudinaryId_key" ON "email"."Attachment"("cloudinaryId");

-- CreateIndex
CREATE INDEX "Attachment_messageId_idx" ON "email"."Attachment"("messageId");

-- AddForeignKey
ALTER TABLE "email"."MessageParticipant" ADD CONSTRAINT "MessageParticipant_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "email"."Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email"."MessageTarget" ADD CONSTRAINT "MessageTarget_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "email"."Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email"."Attachment" ADD CONSTRAINT "Attachment_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "email"."Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;
