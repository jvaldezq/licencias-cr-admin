import prisma from '@/lib/prisma';
import dayjs from 'dayjs';
import { EventStatus, ICashPaymentsAdvance } from '@/lib/definitions';

export const getSalesByUserId = async (userId: string, date?: string) => {
  try {
    let selectedDate = dayjs(new Date()).toISOString();
    if (date) {
      selectedDate = dayjs(date).toISOString();
    }

    let dateFilter = {};
    const startOfDay = dayjs(selectedDate).startOf('day').toISOString();
    const endOfDay = dayjs(selectedDate).endOf('day').toISOString();
    dateFilter = {
      createdAt: {
        gte: startOfDay,
        lte: endOfDay,
      },
    };

    const sales = await prisma.cashPaymentsAdvance.findMany({
      where: {
        ...dateFilter,
        userId,
        payment: {
          event: {
            status: {
              not: EventStatus.DELETED,
            },
          },
        },
      },
      select: {
        amount: true,
        type: true,
        createdAt: true,
        payment: {
          select: {
            event: {
              select: {
                customer: true,
                licenseType: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Calculate totals grouped by type and overall total
    const totalsByType: Record<string, number> = {};
    let totalAmount = 0;

    for (const sale of sales) {
      const { type, amount } = sale;
      if (!type || amount == null) continue;

      totalsByType[type] = (totalsByType[type] || 0) + amount;
      totalAmount += amount;
    }

    return {
      data: sales as unknown as ICashPaymentsAdvance[],
      totals: {
        byType: totalsByType,
        overall: totalAmount,
      },
    };
  } catch (error) {
    throw new Error(`Failed to get events: ${error}`);
  }
};
