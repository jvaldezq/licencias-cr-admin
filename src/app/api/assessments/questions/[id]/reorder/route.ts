import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { reorderQuestions } from '@/services/assessments/questions';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { questionOrders } = body as {
      questionOrders: { id: string; order: number }[];
    };

    if (!questionOrders || !Array.isArray(questionOrders)) {
      return NextResponse.json(
        { error: 'Invalid question orders' },
        { status: 400 }
      );
    }

    await reorderQuestions(params.id, questionOrders);

    revalidatePath('/admin/assessments', 'page');
    return NextResponse.json(
      { message: 'Questions reordered successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error reordering questions', error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
