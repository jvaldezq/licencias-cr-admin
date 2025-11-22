import prisma from '@/lib/prisma';
import { IQuestionForm } from '@/lib/definitions';

export async function createQuestion(data: IQuestionForm) {
  // Get the highest order number for this chapter
  const highestOrder = await prisma.question.findFirst({
    where: { chapterId: data.chapterId },
    orderBy: { order: 'desc' },
    select: { order: true },
  });

  return await prisma.$transaction(async (tx) => {
    const question = await tx.question.create({
      data: {
        chapterId: data.chapterId,
        text: data.text,
        order: data.order ?? (highestOrder?.order ?? 0) + 1,
      },
    });

    // Create answers
    const answers = await Promise.all(
      data.answers.map((answer, index) =>
        tx.answer.create({
          data: {
            questionId: question.id,
            text: answer.text,
            isCorrect: answer.isCorrect,
            order: answer.order ?? index + 1,
          },
        })
      )
    );

    return {
      ...question,
      answers,
    };
  });
}

export async function getQuestionById(id: string) {
  return await prisma.question.findUnique({
    where: { id },
    include: {
      chapter: {
        include: {
          manual: true,
        },
      },
      answers: {
        orderBy: { order: 'asc' },
      },
    },
  });
}

export async function getQuestionsByChapterId(chapterId: string) {
  return await prisma.question.findMany({
    where: { chapterId },
    include: {
      answers: {
        orderBy: { order: 'asc' },
      },
    },
    orderBy: { order: 'asc' },
  });
}

export async function updateQuestion(id: string, data: IQuestionForm) {
  return await prisma.$transaction(async (tx) => {
    // Update question
    const question = await tx.question.update({
      where: { id },
      data: {
        text: data.text,
        order: data.order,
      },
    });

    // Get existing answers
    const existingAnswers = await tx.answer.findMany({
      where: { questionId: id },
    });

    // Delete answers that are not in the new data
    const newAnswerIds = data.answers
      .filter((a) => a.id)
      .map((a) => a.id as string);
    const answersToDelete = existingAnswers.filter(
      (a) => !newAnswerIds.includes(a.id)
    );

    await Promise.all(
      answersToDelete.map((answer) =>
        tx.answer.delete({ where: { id: answer.id } })
      )
    );

    // Update or create answers
    const answers = await Promise.all(
      data.answers.map((answer, index) => {
        if (answer.id) {
          // Update existing answer
          return tx.answer.update({
            where: { id: answer.id },
            data: {
              text: answer.text,
              isCorrect: answer.isCorrect,
              order: answer.order ?? index + 1,
            },
          });
        } else {
          // Create new answer
          return tx.answer.create({
            data: {
              questionId: id,
              text: answer.text,
              isCorrect: answer.isCorrect,
              order: answer.order ?? index + 1,
            },
          });
        }
      })
    );

    return {
      ...question,
      answers,
    };
  });
}

export async function deleteQuestion(id: string) {
  return await prisma.question.delete({
    where: { id },
  });
}

export async function reorderQuestions(
  chapterId: string,
  questionOrders: { id: string; order: number }[]
) {
  return await prisma.$transaction(
    questionOrders.map((question) =>
      prisma.question.update({
        where: { id: question.id, chapterId },
        data: { order: question.order },
      })
    )
  );
}
