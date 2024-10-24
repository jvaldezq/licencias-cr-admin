import prisma from '@/lib/prisma';
import {EventStatus} from "@/lib/definitions";

export const eventComplete = async (id: number) => {
    try {
        await prisma.event.update({
            where: {id},
            data: {
                status: EventStatus.COMPLETED,
            },
        });
        return 'Event completed';

    } catch (error) {
        throw new Error(`Failed to complete event: ${error}`);
    }
};