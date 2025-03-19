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
    select: {
      id: true,
      title: true,
      notes: true,
      assignedTo: true,
      date: true,
      status: true,
    },
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
