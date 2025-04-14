import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import dayjs from 'dayjs';

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
    const body = await request.json();

    const updateData: {
      note?: string;
      oilDate?: Date;
      coolantDate?: Date;
    } = {
      note: body.note,
    };

    if (body.oilDate === true) {
      updateData.oilDate = dayjs().toDate();
    } else if (
      typeof body.oilDate === 'string' ||
      body.oilDate instanceof Date
    ) {
      updateData.oilDate = new Date(body.oilDate);
    }

    if (body.coolantDate === true) {
      updateData.coolantDate = dayjs().toDate();
    } else if (
      typeof body.coolantDate === 'string' ||
      body.coolantDate instanceof Date
    ) {
      updateData.coolantDate = new Date(body.coolantDate);
    }

    const res = await prisma.asset.update({
      where: {
        id: params.id,
      },
      data: updateData,
    });

    revalidatePath('/assets', 'page');
    return NextResponse.json(res, { status: 200 });
  } catch (error) {
    console.error('Pre confirming event', error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
