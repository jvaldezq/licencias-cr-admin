import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import {
  createManual,
  getManualsList,
} from '@/services/assessments/manuals';
import { IManualForm } from '@/lib/definitions';
import { ManualStatus } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as ManualStatus | null;
    const searchTerm = searchParams.get('searchTerm') || undefined;

    const manuals = await getManualsList({
      status: status || undefined,
      searchTerm,
    });

    return NextResponse.json(manuals, { status: 200 });
  } catch (error) {
    console.error('Error fetching manuals', error);
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as IManualForm;

    if (!body || !body.title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    const manual = await createManual(body);

    revalidatePath('/admin/assessments', 'page');
    return NextResponse.json(manual, { status: 200 });
  } catch (error) {
    console.error('Error creating manual', error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
