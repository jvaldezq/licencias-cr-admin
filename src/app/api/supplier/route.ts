import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
BigInt.prototype.toJSON = function () {
  const int = Number.parseInt(this.toString());
  return int ?? this.toString();
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supplier = await prisma.supplier.create({
      data: body,
    });

    revalidatePath('/suppliers', 'page');
    return NextResponse.json(supplier, { status: 200 });
  } catch (error) {
    console.error('Creating task', error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
