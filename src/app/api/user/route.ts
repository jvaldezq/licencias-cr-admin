import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
BigInt.prototype.toJSON = function () {
  const int = Number.parseInt(this.toString());
  return int ?? this.toString();
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId') || '';

  try {
    if (userId) {
      const user = await prisma.user.findFirst({
        select: {
          id: true,
          name: true,
          location: true,
          access: true,
        },
        where: {
          authId: {
            equals: userId,
          },
        },
      });

      return NextResponse.json(user, { status: 200 });
    } else {
      const location = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          location: true,
          access: true,
        },
      });

      return NextResponse.json(location, { status: 200 });
    }
  } catch (error) {
    console.error('Error fetching user', error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
