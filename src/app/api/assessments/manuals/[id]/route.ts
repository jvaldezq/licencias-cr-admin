import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import {
  getManualById,
  updateManual,
  deleteManual,
} from '@/services/assessments/manuals';
import { IManualForm } from '@/lib/definitions';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const manual = await getManualById(params.id);

    if (!manual) {
      return NextResponse.json(
        { error: 'Manual not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(manual, { status: 200 });
  } catch (error) {
    console.error('Error fetching manual', error);
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = (await request.json()) as IManualForm;

    if (!body || !body.title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    const manual = await updateManual(params.id, body);

    revalidatePath('/admin/assessments', 'page');
    revalidatePath(`/admin/assessments/${params.id}`, 'page');
    return NextResponse.json(manual, { status: 200 });
  } catch (error) {
    console.error('Error updating manual', error);
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await deleteManual(params.id);

    revalidatePath('/admin/assessments', 'page');
    return NextResponse.json(
      { message: 'Manual deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting manual', error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
