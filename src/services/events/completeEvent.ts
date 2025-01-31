import prisma from '@/lib/prisma';
import { EventStatus } from '@/lib/definitions';

export const completeEvent = async (id: string, testPassed: boolean) => {
  try {
    console.log('testPassed', testPassed);
    await prisma.event.update({
      select: {
        customerId: true,
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
    return 'Event completed successfully';
  } catch (error) {
    throw new Error(`Failed to move to complete event: ${error}`);
  }
};
