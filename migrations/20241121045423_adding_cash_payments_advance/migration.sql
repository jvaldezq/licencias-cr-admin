/*
  Warnings:

  - You are about to drop the column `type` on the `Payment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "type";

-- CreateTable
CREATE TABLE "CashPaymentsAdvance" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION,
    "type" TEXT,
    "userId" TEXT,
    "paymentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CashPaymentsAdvance_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CashPaymentsAdvance" ADD CONSTRAINT "CashPaymentsAdvance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CashPaymentsAdvance" ADD CONSTRAINT "CashPaymentsAdvance_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
