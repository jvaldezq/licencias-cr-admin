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

// Shuffle array helper function
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export async function generateAssessment(
  manualId: string,
  questionCount: number = 40
) {
  // Fetch the manual with all published chapters and their questions
  const manual = await prisma.manual.findUnique({
    where: { id: manualId },
    include: {
      chapters: {
        orderBy: { order: 'asc' },
        include: {
          questions: {
            include: {
              answers: {
                orderBy: { order: 'asc' },
              },
            },
          },
        },
      },
    },
  });

  if (!manual) {
    throw new Error('Manual not found');
  }

  // Filter only chapters that have questions
  const chaptersWithQuestions = manual.chapters.filter(
    (chapter) => chapter.questions.length > 0
  );

  if (chaptersWithQuestions.length === 0) {
    throw new Error('No content available');
  }

  // Collect all questions from all chapters
  const allQuestions = chaptersWithQuestions.flatMap((chapter) =>
    chapter.questions.map((question) => ({
      ...question,
      chapterId: chapter.id,
      chapterTitle: chapter.title,
    }))
  );

  if (allQuestions.length < questionCount) {
    throw new Error(
      `Insufficient questions (found ${allQuestions.length}, need ${questionCount})`
    );
  }

  // Randomly select questions
  const shuffledQuestions = shuffleArray(allQuestions);
  const selectedQuestions = shuffledQuestions.slice(0, questionCount);

  // Format questions with shuffled answers (without isCorrect flag)
  const formattedQuestions = selectedQuestions.map((question, index) => {
    const shuffledAnswers = shuffleArray(question.answers).map(
      ({ id, text, order }) => ({
        id,
        text,
        order,
      })
    );

    return {
      id: question.id,
      chapterId: question.chapterId,
      chapterTitle: question.chapterTitle,
      order: index + 1,
      text: question.text,
      answers: shuffledAnswers,
    };
  });

  // Generate a temporary assessment ID
  const assessmentId = crypto.randomUUID();

  return {
    assessmentId,
    manual: {
      id: manual.id,
      title: manual.title,
    },
    questions: formattedQuestions,
    totalQuestions: questionCount,
    generatedAt: new Date().toISOString(),
  };
}

interface GradeAnswerInput {
  questionId: string;
  answerId: string;
}

interface QuestionResult {
  questionId: string;
  questionText: string;
  chapterId: string;
  chapterTitle: string;
  selectedAnswerId: string;
  selectedAnswerText: string;
  correctAnswerId: string;
  correctAnswerText: string;
  isCorrect: boolean;
  order: number;
}

interface WeakChapter {
  chapterId: string;
  chapterTitle: string;
  incorrectCount: number;
  totalQuestionsFromChapter: number;
  accuracyPercentage: number;
}

function calculateLetterGrade(percentage: number): string {
  if (percentage >= 90) return 'A';
  if (percentage >= 80) return 'B';
  if (percentage >= 70) return 'C';
  if (percentage >= 60) return 'D';
  return 'F';
}

export async function gradeAssessment(
  assessmentId: string,
  manualId: string,
  answers: GradeAnswerInput[]
) {
  // Validate that the manual exists
  const manual = await prisma.manual.findUnique({
    where: { id: manualId },
    select: { id: true, title: true },
  });

  if (!manual) {
    throw new Error('Manual not found');
  }

  if (answers.length === 0) {
    throw new Error('No answers provided');
  }

  // Extract question IDs from the answers
  const questionIds = answers.map((a) => a.questionId);

  // Fetch all questions with their answers and chapter info
  const questions = await prisma.question.findMany({
    where: {
      id: { in: questionIds },
    },
    include: {
      answers: true,
      chapter: {
        select: {
          id: true,
          title: true,
          manualId: true,
        },
      },
    },
  });

  // Validate that all questions belong to the specified manual
  const invalidQuestions = questions.filter(
    (q) => q.chapter.manualId !== manualId
  );

  if (invalidQuestions.length > 0) {
    throw new Error('Invalid question for this manual');
  }

  // Create a map for quick lookup
  const questionMap = new Map(questions.map((q) => [q.id, q]));

  // Grade each answer
  const results: QuestionResult[] = [];
  const chapterStats = new Map<
    string,
    { chapterId: string; chapterTitle: string; incorrect: number; total: number }
  >();

  for (let i = 0; i < answers.length; i++) {
    const answer = answers[i];
    const question = questionMap.get(answer.questionId);

    if (!question) {
      throw new Error(`Question not found: ${answer.questionId}`);
    }

    // Find the correct answer
    const correctAnswer = question.answers.find((a) => a.isCorrect);
    if (!correctAnswer) {
      throw new Error(`No correct answer found for question: ${question.id}`);
    }

    // Find the selected answer
    const selectedAnswer = question.answers.find((a) => a.id === answer.answerId);
    if (!selectedAnswer) {
      throw new Error(`Invalid answer for question: ${question.id}`);
    }

    const isCorrect = selectedAnswer.id === correctAnswer.id;

    // Track chapter statistics
    const chapterId = question.chapter.id;
    if (!chapterStats.has(chapterId)) {
      chapterStats.set(chapterId, {
        chapterId,
        chapterTitle: question.chapter.title,
        incorrect: 0,
        total: 0,
      });
    }
    const chapterStat = chapterStats.get(chapterId)!;
    chapterStat.total += 1;
    if (!isCorrect) {
      chapterStat.incorrect += 1;
    }

    results.push({
      questionId: question.id,
      questionText: question.text,
      chapterId: question.chapter.id,
      chapterTitle: question.chapter.title,
      selectedAnswerId: selectedAnswer.id,
      selectedAnswerText: selectedAnswer.text,
      correctAnswerId: correctAnswer.id,
      correctAnswerText: correctAnswer.text,
      isCorrect,
      order: i + 1,
    });
  }

  // Calculate score
  const correct = results.filter((r) => r.isCorrect).length;
  const incorrect = results.length - correct;
  const percentage = (correct / results.length) * 100;
  const passed = percentage >= 70;
  const grade = calculateLetterGrade(percentage);

  // Generate study recommendations
  const weakChapters: WeakChapter[] = Array.from(chapterStats.values())
    .filter((stat) => stat.incorrect > 0)
    .map((stat) => ({
      chapterId: stat.chapterId,
      chapterTitle: stat.chapterTitle,
      incorrectCount: stat.incorrect,
      totalQuestionsFromChapter: stat.total,
      accuracyPercentage: ((stat.total - stat.incorrect) / stat.total) * 100,
    }))
    .sort((a, b) => b.incorrectCount - a.incorrectCount);

  const shouldReview = weakChapters.length > 0;
  let summary = 'Great job! You answered all questions correctly.';

  if (shouldReview) {
    summary = '';
  }

  return {
    assessmentId,
    manual: {
      id: manual.id,
      title: manual.title,
    },
    score: {
      correct,
      incorrect,
      total: results.length,
      percentage: Math.round(percentage * 100) / 100,
      passed,
      grade,
    },
    results,
    studyRecommendations: {
      shouldReview,
      weakChapters,
      summary,
    },
    gradedAt: new Date().toISOString(),
  };
}
