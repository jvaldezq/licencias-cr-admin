import prisma from '@/lib/prisma';
import { ITask, TaskStatus } from '@/lib/definitions';
import dayjs from 'dayjs';

interface Filters {
  date: string;
  locationId: string;
}

export const getTasks = async (filters: Filters) => {
  const endOfDay = dayjs(filters?.date).endOf('day').toISOString();
  return (await prisma.task.findMany({
    where: {
      status: {
        equals: TaskStatus.PENDING,
      },
      date: {
        lte: endOfDay,
      },
      locationId: {
        equals: filters.locationId,
      },
    },
  })) as unknown as ITask[];
};
