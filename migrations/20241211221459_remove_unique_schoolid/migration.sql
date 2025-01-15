-- DropIndex
DROP INDEX "SchoolPrices_schoolId_key";

-- AlterTable
ALTER TABLE "School" ALTER COLUMN "status" DROP DEFAULT;
