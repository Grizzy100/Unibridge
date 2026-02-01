-- CreateEnum
CREATE TYPE "OutpassType" AS ENUM ('DAY_PASS', 'LEAVE_PASS');

-- CreateEnum
CREATE TYPE "OutpassStatus" AS ENUM ('PENDING', 'PARENT_APPROVED', 'APPROVED', 'REJECTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ApprovalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "OutpassRequest" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "type" "OutpassType" NOT NULL,
    "reason" TEXT NOT NULL,
    "outgoingDate" TIMESTAMP(3) NOT NULL,
    "returningDate" TIMESTAMP(3) NOT NULL,
    "proofUrl" TEXT,
    "proofPublicId" TEXT,
    "status" "OutpassStatus" NOT NULL DEFAULT 'PENDING',
    "parentApproval" "ApprovalStatus" NOT NULL DEFAULT 'PENDING',
    "parentApprovedAt" TIMESTAMP(3),
    "wardenApproval" "ApprovalStatus" NOT NULL DEFAULT 'PENDING',
    "wardenApprovedAt" TIMESTAMP(3),
    "wardenRejectionComment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OutpassRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OutpassRequest_studentId_idx" ON "OutpassRequest"("studentId");

-- CreateIndex
CREATE INDEX "OutpassRequest_status_idx" ON "OutpassRequest"("status");

-- CreateIndex
CREATE INDEX "OutpassRequest_outgoingDate_returningDate_idx" ON "OutpassRequest"("outgoingDate", "returningDate");
