/*
  Warnings:

  - You are about to drop the column `assetEndDate` on the `Schedule` table. All the data in the column will be lost.
  - You are about to drop the column `assetStartDate` on the `Schedule` table. All the data in the column will be lost.
  - You are about to drop the column `eventEndDate` on the `Schedule` table. All the data in the column will be lost.
  - You are about to drop the column `eventStartDate` on the `Schedule` table. All the data in the column will be lost.
  - You are about to drop the column `instructorEndDate` on the `Schedule` table. All the data in the column will be lost.
  - You are about to drop the column `instructorStartDate` on the `Schedule` table. All the data in the column will be lost.
  - Added the required column `endDate` to the `Schedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Schedule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Schedule" DROP COLUMN "assetEndDate",
DROP COLUMN "assetStartDate",
DROP COLUMN "eventEndDate",
DROP COLUMN "eventStartDate",
DROP COLUMN "instructorEndDate",
DROP COLUMN "instructorStartDate",
ADD COLUMN     "assetId" BIGINT,
ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" BIGINT;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
