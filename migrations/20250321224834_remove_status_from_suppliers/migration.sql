/*
  Warnings:

  - You are about to drop the column `status` on the `Supplier` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Supplier" DROP COLUMN "status",
ADD COLUMN     "category" TEXT;
