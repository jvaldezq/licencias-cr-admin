import prisma from '@/lib/prisma';
import { EventStatus, LOG_TITLES } from '@/lib/definitions';
import { logEvent } from '@/services/logs/logEvent';

export const completeEvent = async (id: string, testPassed: boolean) => {
  try {
    const event = await prisma.event.update({
      select: {
        id: true,
        status: true,
        customer: {
          select: {
            testPassed: true,
          },
        },
      },
      where: { id },
      data: {
        status: EventStatus.COMPLETED,
        customer: {
          update: {
            testPassed: testPassed,
          },
        },
      },
    });

    await logEvent({
      title: LOG_TITLES.UPDATED,
      message: JSON.stringify(event),
      eventId: event.id,
    });
    return 'Event completed successfully';
  } catch (error) {
    throw new Error(`Failed to move to complete event: ${error}`);
  }
};
