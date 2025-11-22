import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { reorderChapters } from '@/services/assessments/chapters';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { chapterOrders } = body as {
      chapterOrders: { id: string; order: number }[];
    };

    if (!chapterOrders || !Array.isArray(chapterOrders)) {
      return NextResponse.json(
        { error: 'Invalid chapter orders' },
        { status: 400 }
      );
    }

    await reorderChapters(params.id, chapterOrders);

    revalidatePath('/admin/assessments', 'page');
    revalidatePath(`/admin/assessments/${params.id}`, 'page');
    return NextResponse.json(
      { message: 'Chapters reordered successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error reordering chapters', error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
