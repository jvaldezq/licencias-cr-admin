/*
  Warnings:

  - Made the column `userId` on table `CashPaymentsAdvance` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "CashPaymentsAdvance" DROP CONSTRAINT "CashPaymentsAdvance_userId_fkey";

-- AlterTable
ALTER TABLE "CashPaymentsAdvance" ALTER COLUMN "userId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "CashPaymentsAdvance" ADD CONSTRAINT "CashPaymentsAdvance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
