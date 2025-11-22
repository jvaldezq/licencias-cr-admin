import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import {
  createChapter,
  getChaptersByManualId,
} from '@/services/assessments/chapters';
import { IChapterForm } from '@/lib/definitions';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const manualId = searchParams.get('manualId');

    if (!manualId) {
      return NextResponse.json(
        { error: 'Manual ID is required' },
        { status: 400 }
      );
    }

    const chapters = await getChaptersByManualId(manualId);

    return NextResponse.json(chapters, { status: 200 });
  } catch (error) {
    console.error('Error fetching chapters', error);
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as IChapterForm;

    if (!body || !body.title || !body.manualId) {
      return NextResponse.json(
        { error: 'Title and Manual ID are required' },
        { status: 400 }
      );
    }

    const chapter = await createChapter(body);

    revalidatePath('/admin/assessments', 'page');
    revalidatePath(`/admin/assessments/${body.manualId}`, 'page');
    return NextResponse.json(chapter, { status: 200 });
  } catch (error) {
    console.error('Error creating chapter', error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
