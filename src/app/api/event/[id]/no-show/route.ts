import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { noShowEvent } from '@/services/events/noShowEvent';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
BigInt.prototype.toJSON = function () {
  const int = Number.parseInt(this.toString());
  return int ?? this.toString();
};

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const res = await noShowEvent(params.id);

    revalidatePath('/events', 'page');
    return NextResponse.json(res, { status: 200 });
  } catch (error) {
    console.error('Pre confirming event', error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
