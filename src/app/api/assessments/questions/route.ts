import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import {
  createQuestion,
  getQuestionsByChapterId,
} from '@/services/assessments/questions';
import { IQuestionForm } from '@/lib/definitions';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const chapterId = searchParams.get('chapterId');

    if (!chapterId) {
      return NextResponse.json(
        { error: 'Chapter ID is required' },
        { status: 400 }
      );
    }

    const questions = await getQuestionsByChapterId(chapterId);

    return NextResponse.json(questions, { status: 200 });
  } catch (error) {
    console.error('Error fetching questions', error);
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as IQuestionForm;

    if (
      !body ||
      !body.text ||
      !body.chapterId ||
      !body.answers ||
      body.answers.length < 2
    ) {
      return NextResponse.json(
        { error: 'Text, Chapter ID, and at least 2 answers are required' },
        { status: 400 }
      );
    }

    // Validate at least one correct answer
    const hasCorrectAnswer = body.answers.some((answer) => answer.isCorrect);
    if (!hasCorrectAnswer) {
      return NextResponse.json(
        { error: 'At least one answer must be marked as correct' },
        { status: 400 }
      );
    }

    const question = await createQuestion(body);

    revalidatePath('/admin/assessments', 'page');
    return NextResponse.json(question, { status: 200 });
  } catch (error) {
    console.error('Error creating question', error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
