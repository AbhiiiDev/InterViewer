-- CreateEnum
CREATE TYPE "InterviewStatus" AS ENUM ('LIVE', 'COMPLETED');

-- CreateTable
CREATE TABLE "Interview" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "InterviewStatus" NOT NULL DEFAULT 'LIVE',

    CONSTRAINT "Interview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CodeSnapshot" (
    "id" TEXT NOT NULL,
    "interviewId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CodeSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Interview_roomId_key" ON "Interview"("roomId");

-- AddForeignKey
ALTER TABLE "CodeSnapshot" ADD CONSTRAINT "CodeSnapshot_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "Interview"("id") ON DELETE CASCADE ON UPDATE CASCADE;
