/*
  Warnings:

  - You are about to drop the column `action` on the `Log` table. All the data in the column will be lost.
  - You are about to drop the column `changes` on the `Log` table. All the data in the column will be lost.
  - You are about to drop the column `modelName` on the `Log` table. All the data in the column will be lost.
  - Added the required column `message` to the `Log` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Log` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Log" DROP COLUMN "action",
DROP COLUMN "changes",
DROP COLUMN "modelName",
ADD COLUMN     "assetId" TEXT,
ADD COLUMN     "eventId" TEXT,
ADD COLUMN     "message" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;
