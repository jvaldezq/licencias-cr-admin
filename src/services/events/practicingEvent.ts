import prisma from '@/lib/prisma';
import { EventStatus } from '@/lib/definitions';

export const practicingEvent = async (id: string) => {
  try {
    await prisma.event.update({
      where: { id },
      data: {
        status: EventStatus.PRACTICING,
      },
    });
    return 'Event practicing successfully';
  } catch (error) {
    throw new Error(`Failed to move to practicing event: ${error}`);
  }
};
