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
  _: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const supplier = await prisma.supplier.findUnique({
      where: {
        id: params.id,
      },
    });
    return NextResponse.json(supplier, { status: 200 });
  } catch (error) {
    console.error('Error fetching supplier', error);
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const supplier = await prisma.supplier.delete({
      where: {
        id: params.id,
      },
    });

    revalidatePath('/suppliers', 'page');
    return NextResponse.json(supplier, { status: 200 });
  } catch (error) {
    console.error('Error deleting supplier', error);
    return NextResponse.json({ error }, { status: 500 });
  }
}


export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const body = await request.json();

    const supplier = await prisma.supplier.update({
      where: {
        id: params.id,
      },
      data: body,
    });

    revalidatePath('/suppliers', 'page');
    return NextResponse.json(supplier, { status: 200 });
  } catch (error) {
    console.error('Updating suppliers', error);
    return NextResponse.json({ error }, { status: 500 });
  }
}