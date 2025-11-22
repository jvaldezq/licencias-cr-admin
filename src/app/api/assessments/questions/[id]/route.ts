import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import {
  getQuestionById,
  updateQuestion,
  deleteQuestion,
} from '@/services/assessments/questions';
import { IQuestionForm } from '@/lib/definitions';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const question = await getQuestionById(params.id);

    if (!question) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(question, { status: 200 });
  } catch (error) {
    console.error('Error fetching question', error);
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = (await request.json()) as IQuestionForm;

    if (!body || !body.text || !body.answers || body.answers.length < 2) {
      return NextResponse.json(
        { error: 'Text and at least 2 answers are required' },
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

    const question = await updateQuestion(params.id, body);

    revalidatePath('/admin/assessments', 'page');
    return NextResponse.json(question, { status: 200 });
  } catch (error) {
    console.error('Error updating question', error);
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await deleteQuestion(params.id);

    revalidatePath('/admin/assessments', 'page');
    return NextResponse.json(
      { message: 'Question deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting question', error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
