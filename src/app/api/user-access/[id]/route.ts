import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

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
    const userAccess = await prisma.userAccess.findUnique({
      where: {
        id: params.id,
      },
    });
    return NextResponse.json(userAccess, { status: 200 });
  } catch (error) {
    console.error('Error fetching userAccess', error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
