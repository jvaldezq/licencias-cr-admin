import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
BigInt.prototype.toJSON = function () {
  const int = Number.parseInt(this.toString());
  return int ?? this.toString();
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const locationId = searchParams.get('locationId');

    const assets = await prisma.asset.findMany({
      select: {
        id: true,
        name: true,
      },
      where: {
        status: {
          equals: true,
        },
        ...(locationId
          ? {
              locationId: {
                equals: locationId,
              },
            }
          : {}),
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(assets, { status: 200 });
  } catch (error) {
    console.error('Error fetching assets by location', error);
    return NextResponse.json({ error }, { status: 500 });
  }
}

