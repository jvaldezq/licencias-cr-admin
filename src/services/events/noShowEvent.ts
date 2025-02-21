import prisma from '@/lib/prisma';
import { EventStatus, LOG_TITLES } from '@/lib/definitions';
import { logEvent } from '@/services/logs/logEvent';

export const noShowEvent = async (id: string) => {
  try {
    const event = await prisma.event.update({
      select: {
        id: true,
        noShow: true,
        status: true,
      },
      where: { id },
      data: {
        noShow: true,
        status: EventStatus.NO_SHOW,
      },
    });

    await logEvent({
      title: LOG_TITLES.UPDATED,
      message: JSON.stringify(event),
      eventId: event.id,
    });
    return 'Event no show successfully';
  } catch (error) {
    throw new Error(`Failed to move to no show event: ${error}`);
  }
};
