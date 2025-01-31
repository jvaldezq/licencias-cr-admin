import prisma from '@/lib/prisma';
import { EventStatus } from '@/lib/definitions';

export const noShowEvent = async (id: string) => {
  try {
    await prisma.event.update({
      where: { id },
      data: {
        noShow: true,
        status: EventStatus.NO_SHOW,
      },
    });
    return 'Event no show successfully';
  } catch (error) {
    throw new Error(`Failed to move to no show event: ${error}`);
  }
};
