import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
BigInt.prototype.toJSON = function () {
  const int = Number.parseInt(this.toString());
  return int ?? this.toString();
};

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const location = await prisma.location.findUnique({
      where: {
        id: params.id,
      },
    });
    return NextResponse.json(location, { status: 200 });
  } catch (error) {
    console.error('Error fetching location', error);
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const location = await prisma.location.delete({
      where: {
        id: params.id,
      },
    });
    revalidatePath('/locations', 'page');
    return NextResponse.json(location, { status: 200 });
  } catch (error) {
    console.error('Error deleting location', error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
