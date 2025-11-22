import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import {
  getChapterById,
  updateChapter,
  deleteChapter,
} from '@/services/assessments/chapters';
import { IChapterForm } from '@/lib/definitions';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const chapter = await getChapterById(params.id);

    if (!chapter) {
      return NextResponse.json(
        { error: 'Chapter not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(chapter, { status: 200 });
  } catch (error) {
    console.error('Error fetching chapter', error);
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = (await request.json()) as IChapterForm;

    if (!body || !body.title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    const chapter = await updateChapter(params.id, body);

    revalidatePath('/admin/assessments', 'page');
    revalidatePath(`/admin/assessments/${chapter.manualId}`, 'page');
    revalidatePath(
      `/admin/assessments/${chapter.manualId}/chapters/${params.id}`,
      'page'
    );
    return NextResponse.json(chapter, { status: 200 });
  } catch (error) {
    console.error('Error updating chapter', error);
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const chapter = await getChapterById(params.id);
    const manualId = chapter?.manualId;

    await deleteChapter(params.id);

    revalidatePath('/admin/assessments', 'page');
    if (manualId) {
      revalidatePath(`/admin/assessments/${manualId}`, 'page');
    }
    return NextResponse.json(
      { message: 'Chapter deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting chapter', error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
