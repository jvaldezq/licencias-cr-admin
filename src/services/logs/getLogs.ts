import prisma from '@/lib/prisma';

interface Props {
  eventId?: string;
  assetId?: string;
}
export async function getLogs(props: Props) {
  try {
    const { eventId, assetId } = props;
    let eventIdFilter = {};
    let assetIdFilter = {};
    let created;

    if (eventId) {
      eventIdFilter = {
        eventId: {
          equals: eventId,
        },
      };
      created = await prisma.event.findUnique({
        select: {
          createdBy: true,
          createdAt: true,
        },
        where: {
          id: eventId,
        },
      });
    }
    if (assetId) {
      assetIdFilter = {
        assetId: {
          equals: assetId,
        },
      };
    }

    const logs = await prisma.log.findMany({
      select: {
        title: true,
        message: true,
        createdAt: true,
        changedBy: true,
      },
      where: {
        AND: [eventIdFilter, assetIdFilter],
      },
    });

    return {
      created,
      logs,
    };
  } catch (error) {
    console.error('Error logging event:', error);
  }
}
