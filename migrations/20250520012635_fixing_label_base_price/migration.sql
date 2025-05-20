/*
  Warnings:

  - You are about to drop the column `priceShool` on the `BasePrice` table. All the data in the column will be lost.
  - Made the column `description` on table `BasePrice` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "BasePrice" DROP COLUMN "priceShool",
ADD COLUMN     "priceSchool" DOUBLE PRECISION,
ALTER COLUMN "description" SET NOT NULL;
