import prisma from '@/lib/prisma';
import { logEvent } from '@/services/logs/logEvent';
import { LOG_TITLES } from '@/lib/definitions';

export const confirmEvent = async (id: string) => {
  try {
    const event = await prisma.event.update({
      select: {
        id: true,
        hasBeenContacted: true,
      },
      where: { id },
      data: {
        hasBeenContacted: true,
      },
    });

    await logEvent({
      title: LOG_TITLES.UPDATED,
      message: JSON.stringify(event),
      eventId: event.id,
    });
    return 'Event confirmed successfully';
  } catch (error) {
    throw new Error(`Failed to move to confirm event: ${error}`);
  }
};
