import prisma from '@/lib/prisma';
import { IChapterForm } from '@/lib/definitions';

export async function createChapter(data: IChapterForm) {
  // Get the highest order number for this manual
  const highestOrder = await prisma.chapter.findFirst({
    where: { manualId: data.manualId },
    orderBy: { order: 'desc' },
    select: { order: true },
  });

  return await prisma.chapter.create({
    data: {
      manualId: data.manualId,
      title: data.title,
      content: data.content || '',
      order: data.order ?? (highestOrder?.order ?? 0) + 1,
    },
    include: {
      questions: {
        orderBy: { order: 'asc' },
      },
    },
  });
}

export async function getChapterById(id: string) {
  return await prisma.chapter.findUnique({
    where: { id },
    include: {
      manual: true,
      questions: {
        orderBy: { order: 'asc' },
        include: {
          answers: {
            orderBy: { order: 'asc' },
          },
        },
      },
    },
  });
}

export async function getChaptersByManualId(manualId: string) {
  return await prisma.chapter.findMany({
    where: { manualId },
    include: {
      questions: {
        select: {
          id: true,
        },
      },
    },
    orderBy: { order: 'asc' },
  });
}

export async function updateChapter(id: string, data: IChapterForm) {
  return await prisma.chapter.update({
    where: { id },
    data: {
      title: data.title,
      content: data.content,
      order: data.order,
    },
    include: {
      questions: {
        orderBy: { order: 'asc' },
      },
    },
  });
}

export async function deleteChapter(id: string) {
  return await prisma.chapter.delete({
    where: { id },
  });
}

export async function reorderChapters(
  manualId: string,
  chapterOrders: { id: string; order: number }[]
) {
  return await prisma.$transaction(
    chapterOrders.map((chapter) =>
      prisma.chapter.update({
        where: { id: chapter.id, manualId },
        data: { order: chapter.order },
      })
    )
  );
}
