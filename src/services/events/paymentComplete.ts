import prisma from '@/lib/prisma';
import {EventStatus, IUser, PAYMENT_TYPE} from "@/lib/definitions";

export const paymentComplete = async (id: string, body: {
    id: string, type: PAYMENT_TYPE, amount: number, user: IUser
}) => {
    try {
        const event = await prisma.event.findUnique({
            where: {id},
            select: {
                payment: true
            }
        })
        const payment = event?.payment;
        const cashAdvance = payment?.cashAdvance || 0;
        const price = payment?.price || 0;
        const cashAdvanceAndPayment = cashAdvance + +body?.amount;
        const cashAdvanceTotal = cashAdvance + +body?.amount;

        if (cashAdvanceAndPayment > price) {
            throw new Error('Payment exceeds the price');
        }

        if (cashAdvanceAndPayment === price) {
            await prisma.event.update({
                where: {id}, data: {
                    status: EventStatus.PAID,
                },
            });
        }

        await prisma.payment.update({
            where: {id: payment?.id}, data: {
                cashAdvance: cashAdvanceTotal
            }
        })

        await prisma.cashPaymentsAdvance.create({
            data: {
                amount: body.amount,
                userId: body?.user?.id,
                paymentId: payment?.id || '',
                type: body.type,
            }
        })
        return 'Payment applied successfully';

    } catch (error) {
        throw new Error(`Failed to complete event: ${error}`);
    }
};