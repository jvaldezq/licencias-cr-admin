import prisma from '@/lib/prisma';
import { IUser, LOG_TITLES, PAYMENT_TYPE } from '@/lib/definitions';
import { logEvent } from '@/services/logs/logEvent';

export const paymentComplete = async (
  id: string,
  body: {
    id: string;
    type: PAYMENT_TYPE;
    amount: number;
    user: IUser;
  },
) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id },
      select: {
        id: true,
        payment: true,
      },
    });
    const payment = event?.payment;
    const cashAdvance = payment?.cashAdvance || 0;
    const price = payment?.price || 0;
    const cashAdvanceAndPayment = cashAdvance + +body?.amount;
    const cashAdvanceTotal = cashAdvance + +body?.amount;

    if (cashAdvanceAndPayment > price) {
      throw new Error('Payment exceeds the price');
    }

    await prisma.cashPaymentsAdvance.create({
      data: {
        amount: body.amount,
        userId: body?.user?.id,
        paymentId: payment?.id || '',
        type: body.type,
      },
    });

    const newPayment = await prisma.payment.update({
      select: {
        cashPaymentsAdvance: true,
      },
      where: { id: payment?.id },
      data: {
        cashAdvance: cashAdvanceTotal,
      },
    });

    if (event?.id) {
      await logEvent({
        title: LOG_TITLES.UPDATED,
        message: JSON.stringify({ payment: newPayment }),
        eventId: event.id,
      });
    }

    return 'Payment applied successfully';
  } catch (error) {
    throw new Error(`Failed to complete event: ${error}`);
  }
};
