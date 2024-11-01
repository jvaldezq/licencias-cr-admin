import prisma from '@/lib/prisma';
import {EventStatus} from "@/lib/definitions";

export const eventComplete = async (id: string, paymentType: string) => {
    try {
        const event = await prisma.event.update({
            where: {id}, data: {
                status: EventStatus.COMPLETED,
            },
        });
        await prisma.payment.update({
            where: {id: event.paymentId}, data: {
                type: paymentType
            }
        })
        return 'Event completed';

    } catch (error) {
        throw new Error(`Failed to complete event: ${error}`);
    }
};