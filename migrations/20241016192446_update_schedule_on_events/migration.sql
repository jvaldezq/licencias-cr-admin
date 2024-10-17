/*
  Warnings:

  - You are about to drop the column `isMissingInfo` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `customerId` on the `Schedule` table. All the data in the column will be lost.
  - You are about to drop the column `color` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[scheduleId]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.
  - Made the column `licenseTypeId` on table `Event` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_licenseTypeId_fkey";

-- DropForeignKey
ALTER TABLE "Schedule" DROP CONSTRAINT "Schedule_customerId_fkey";

-- DropIndex
DROP INDEX "User_color_key";

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "scheduleId" BIGINT;

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "isMissingInfo",
ALTER COLUMN "licenseTypeId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Schedule" DROP COLUMN "customerId",
ALTER COLUMN "startDate" DROP NOT NULL,
ALTER COLUMN "endDate" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "color";

-- CreateIndex
CREATE UNIQUE INDEX "Customer_scheduleId_key" ON "Customer"("scheduleId");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_licenseTypeId_fkey" FOREIGN KEY ("licenseTypeId") REFERENCES "LicenseType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE SET NULL ON UPDATE CASCADE;
