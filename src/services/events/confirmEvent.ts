import prisma from '@/lib/prisma';

export const confirmEvent = async (id: string) => {
  try {
    await prisma.event.update({
      where: { id },
      data: {
        hasBeenContacted: true,
      },
    });
    return 'Event confirmed successfully';
  } catch (error) {
    throw new Error(`Failed to move to confirm event: ${error}`);
  }
};
