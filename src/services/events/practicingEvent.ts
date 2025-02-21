import prisma from '@/lib/prisma';
import { EventStatus, LOG_TITLES } from '@/lib/definitions';
import { logEvent } from '@/services/logs/logEvent';

export const practicingEvent = async (id: string) => {
  try {
    const event = await prisma.event.update({
      select: {
        id: true,
        status: true,
      },
      where: { id },
      data: {
        status: EventStatus.PRACTICING,
      },
    });

    await logEvent({
      title: LOG_TITLES.UPDATED,
      message: JSON.stringify(event),
      eventId: event.id,
    });
    return 'Event practicing successfully';
  } catch (error) {
    throw new Error(`Failed to move to practicing event: ${error}`);
  }
};
