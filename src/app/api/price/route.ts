import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
BigInt.prototype.toJSON = function () {
  const int = Number.parseInt(this.toString());
  return int ?? this.toString();
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const locationIdParam = searchParams.get('locationId');

    const locationIdFilter = locationIdParam
      ? {
          locationId: {
            equals: locationIdParam,
          },
        }
      : {};

    const price = await prisma.basePrice.findMany({
      select: {
        id: true,
        note: true,
        description: true,
        priceClient: true,
        priceSchool: true,
        location: true,
      },
      where: {
        ...locationIdFilter,
      },
    });

    return NextResponse.json(price, { status: 200 });
  } catch (error) {
    console.error('Error fetching price', error);
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const price = await prisma.basePrice.create({
      data: body,
    });

    revalidatePath('/prices', 'page');
    return NextResponse.json(price, { status: 200 });
  } catch (error) {
    console.error('Creating price', error);
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();

    const price = await prisma.basePrice.update({
      where: {
        id: body.id,
      },
      data: body,
    });

    revalidatePath('/prices', 'page');
    return NextResponse.json(price, { status: 200 });
  } catch (error) {
    console.error('Updating price', error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
