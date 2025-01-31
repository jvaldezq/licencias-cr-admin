import prisma from '@/lib/prisma';
import { EventStatus, LOG_TITLES } from '@/lib/definitions';
import { logEvent } from '@/services/logs/logEvent';

export const eventDelete = async (id: string) => {
  try {
    const event = await prisma.event.update({
      where: { id },
      data: {
        status: EventStatus.DELETED,
      },
    });

    await logEvent({
      title: LOG_TITLES.DELETED,
      message: '',
      eventId: event.id,
    });
    return 'Event deleted';
  } catch (error) {
    throw new Error(`Failed to delete event: ${error}`);
  }
};
