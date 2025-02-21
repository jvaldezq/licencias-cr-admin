import prisma from '@/lib/prisma';
import { EventStatus, LOG_TITLES } from '@/lib/definitions';
import { logEvent } from '@/services/logs/logEvent';

export const eventDelete = async (id: string) => {
  try {
    const event = await prisma.event.update({
      select: {
        id: true,
        type: {
          select: {
            name: true,
          },
        },
        notes: true,
        customer: {
          select: {
            name: true,
            identification: true,
            phone: true,
            schedule: {
              select: {
                startTime: true,
                endTime: true,
              },
            },
            testPassed: true,
          },
        },
        location: {
          select: {
            name: true,
          },
        },
        licenseType: {
          select: {
            name: true,
          },
        },
        date: true,
        time: true,
        instructor: {
          select: {
            name: true,
          },
        },
        asset: {
          select: {
            name: true,
          },
        },
        createdById: true,
        payment: {
          select: {
            price: true,
            cashAdvance: true,
            paid: true,
            paidDate: true,
            cashPaymentsAdvance: true,
          },
        },
        hasMedical: true,
        isInternalReferred: true,
        isExternalReferred: true,
      },
      where: { id },
      data: {
        status: EventStatus.DELETED,
      },
    });

    await logEvent({
      title: LOG_TITLES.DELETED,
      message: JSON.stringify(event),
      eventId: event.id,
    });
    return 'Event deleted';
  } catch (error) {
    throw new Error(`Failed to delete event: ${error}`);
  }
};
