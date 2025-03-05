import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getSession } from '@auth0/nextjs-auth0';
import { IEventFilter, TaskStatus } from '@/lib/definitions';
import dayjs from 'dayjs';
import { getTasks } from '@/app/api/task/getTasks';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
BigInt.prototype.toJSON = function () {
  const int = Number.parseInt(this.toString());
  return int ?? this.toString();
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filtersText = searchParams.get('filters') ?? '';
    const filters = JSON.parse(atob(filtersText)) as IEventFilter;
    const tasks = await getTasks(filters);

    return NextResponse.json(tasks, { status: 200 });
  } catch (error) {
    console.error('Error fetching task', error);
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function POST(request: Request) {
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

    const task = await prisma.task.create({
      data: {
        status: TaskStatus.PENDING,
        title: body.title,
        locationId: body.locationId,
        date: selectedDate,
        notes: body.notes,
        createdById: user?.id || '',
      },
    });

    revalidatePath('/events', 'page');
    return NextResponse.json(task, { status: 200 });
  } catch (error) {
    console.error('Creating task', error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
