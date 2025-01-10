/*
  Warnings:

  - You are about to drop the column `isReferred` on the `Event` table. All the data in the column will be lost.
  - Made the column `amount` on table `CashPaymentsAdvance` required. This step will fail if there are existing NULL values in that column.
  - Made the column `type` on table `CashPaymentsAdvance` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "CashPaymentsAdvance" ALTER COLUMN "amount" SET NOT NULL,
ALTER COLUMN "type" SET NOT NULL;

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "isReferred",
ADD COLUMN     "isExternalReferred" BOOLEAN DEFAULT false,
ADD COLUMN     "isInternalReferred" BOOLEAN DEFAULT false,
ADD COLUMN     "schoolId" TEXT;

-- CreateTable
CREATE TABLE "School" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "School_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SchoolPrices" (
    "id" TEXT NOT NULL,
    "internalPrice" TEXT NOT NULL,
    "externalPrice" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "schoolId" TEXT,
    "licenseTypeId" TEXT,

    CONSTRAINT "SchoolPrices_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SchoolPrices_schoolId_key" ON "SchoolPrices"("schoolId");

-- CreateIndex
CREATE UNIQUE INDEX "SchoolPrices_licenseTypeId_key" ON "SchoolPrices"("licenseTypeId");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolPrices" ADD CONSTRAINT "SchoolPrices_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolPrices" ADD CONSTRAINT "SchoolPrices_licenseTypeId_fkey" FOREIGN KEY ("licenseTypeId") REFERENCES "LicenseType"("id") ON DELETE SET NULL ON UPDATE CASCADE;
