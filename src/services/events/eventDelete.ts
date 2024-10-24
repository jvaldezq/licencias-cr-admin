import prisma from '@/lib/prisma';
import {EventStatus} from "@/lib/definitions";

export const eventDelete = async (id: number) => {
    try {
        await prisma.event.update({
            where: {id},
            data: {
                status: EventStatus.DELETED,
            },
        });
        return 'Event deleted';

    } catch (error) {
        throw new Error(`Failed to delete event: ${error}`);
    }
};