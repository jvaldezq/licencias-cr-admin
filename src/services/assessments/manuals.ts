import prisma from '@/lib/prisma';
import { IManualForm } from '@/lib/definitions';
import { ManualStatus } from '@prisma/client';

export async function createManual(data: IManualForm) {
  return await prisma.manual.create({
    data: {
      title: data.title,
      description: data.description,
      status: data.status || ManualStatus.DRAFT,
    },
    include: {
      chapters: {
        orderBy: { order: 'asc' },
      },
    },
  });
}

export async function getManualById(id: string) {
  return await prisma.manual.findUnique({
    where: { id },
    include: {
      chapters: {
        orderBy: { order: 'asc' },
        include: {
          questions: {
            orderBy: { order: 'asc' },
          },
        },
      },
    },
  });
}

export async function getManualsList(filters?: {
  status?: ManualStatus;
  searchTerm?: string;
}) {
  return await prisma.manual.findMany({
    where: {
      ...(filters?.status && { status: filters.status }),
      ...(filters?.searchTerm && {
        OR: [
          { title: { contains: filters.searchTerm, mode: 'insensitive' } },
          { description: { contains: filters.searchTerm, mode: 'insensitive' } },
        ],
      }),
    },
    include: {
      chapters: {
        orderBy: { order: 'asc' },
        select: {
          id: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function updateManual(id: string, data: IManualForm) {
  return await prisma.manual.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
      status: data.status,
    },
    include: {
      chapters: {
        orderBy: { order: 'asc' },
      },
    },
  });
}

export async function deleteManual(id: string) {
  return await prisma.manual.delete({
    where: { id },
  });
}
