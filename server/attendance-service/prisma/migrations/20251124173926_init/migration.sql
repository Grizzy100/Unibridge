-- CreateEnum
CREATE TYPE "attendance"."AttendanceStatus" AS ENUM ('PRESENT', 'ABSENT');

-- CreateEnum
CREATE TYPE "attendance"."SessionStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'CANCELLED');

-- CreateTable
CREATE TABLE "attendance"."AttendanceSession" (
    "id" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "sessionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sessionStartTime" TIMESTAMP(3) NOT NULL,
    "sessionEndTime" TIMESTAMP(3) NOT NULL,
    "qrCode" TEXT NOT NULL,
    "qrGeneratedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "qrExpiresAt" TIMESTAMP(3) NOT NULL,
    "status" "attendance"."SessionStatus" NOT NULL DEFAULT 'ACTIVE',
    "location" TEXT,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AttendanceSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attendance"."AttendanceRecord" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "enrollmentNumber" TEXT,
    "status" "attendance"."AttendanceStatus" NOT NULL DEFAULT 'ABSENT',
    "markedAt" TIMESTAMP(3),
    "hasApprovedOutpass" BOOLEAN NOT NULL DEFAULT false,
    "outpassCheckAt" TIMESTAMP(3),
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AttendanceRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AttendanceSession_qrCode_key" ON "attendance"."AttendanceSession"("qrCode");

-- CreateIndex
CREATE INDEX "AttendanceSession_teacherId_idx" ON "attendance"."AttendanceSession"("teacherId");

-- CreateIndex
CREATE INDEX "AttendanceSession_courseId_idx" ON "attendance"."AttendanceSession"("courseId");

-- CreateIndex
CREATE INDEX "AttendanceSession_sessionDate_idx" ON "attendance"."AttendanceSession"("sessionDate");

-- CreateIndex
CREATE INDEX "AttendanceSession_qrCode_idx" ON "attendance"."AttendanceSession"("qrCode");

-- CreateIndex
CREATE INDEX "AttendanceRecord_studentId_idx" ON "attendance"."AttendanceRecord"("studentId");

-- CreateIndex
CREATE INDEX "AttendanceRecord_status_idx" ON "attendance"."AttendanceRecord"("status");

-- CreateIndex
CREATE UNIQUE INDEX "AttendanceRecord_sessionId_studentId_key" ON "attendance"."AttendanceRecord"("sessionId", "studentId");

-- AddForeignKey
ALTER TABLE "attendance"."AttendanceRecord" ADD CONSTRAINT "AttendanceRecord_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "attendance"."AttendanceSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
