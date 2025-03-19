import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getSession } from '@auth0/nextjs-auth0';
import dayjs from 'dayjs';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
BigInt.prototype.toJSON = function () {
  const int = Number.parseInt(this.toString());
  return int ?? this.toString();
};

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const task = await prisma.task.findUnique({
      where: {
        id: params.id,
      },
    });
    return NextResponse.json(task, { status: 200 });
  } catch (error) {
    console.error('Error fetching task', error);
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const body = await request.json();
    const selectedDate = dayjs(body.date).toISOString();
    const session = await getSession();
    const userId = session?.user?.sub?.split('|')[1];
    const user = await prisma.user.findUnique({
      where: {
        authId: userId,
      },
      select: {
        id: true,
      },
    });

    const task = await prisma.task.update({
      where: {
        id: params.id,
      },
      data: {
        title: body.title,
        locationId: body.locationId,
        assignedToId: body.assignedToId,
        date: selectedDate,
        notes: body.notes,
        createdById: user?.id || '',
      },
    });

    revalidatePath('/events', 'page');
    return NextResponse.json(task, { status: 200 });
  } catch (error) {
    console.error('Updating task', error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
