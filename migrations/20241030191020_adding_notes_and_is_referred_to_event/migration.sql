-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "isReferred" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "notes" TEXT;
