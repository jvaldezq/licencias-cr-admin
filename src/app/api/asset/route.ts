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
    const list = searchParams.get('list');
    const licenseTypeId = searchParams.get('licenseTypeId');
    const locationIdParam = searchParams.get('locationId');

    const licenseType = licenseTypeId
      ? {
          licenseTypeId: {
            equals: licenseTypeId,
          },
        }
      : {};

    if (list) {
      let locationId = {};
      // Return all if locationId is not San Ramon or Ciudad Vial
      if (
        [
          '5c7a2198-1ec4-4111-b926-172aefbd7f1c',
          'ea54ee9e-25db-4a66-8610-c5337701e3ce',
        ].includes(locationIdParam || '')
      ) {
        locationId = {
          location: {
            id: {
              equals: locationIdParam,
            },
          },
        };
      }

      const asset = await prisma.asset.findMany({
        select: {
          id: true,
          name: true,
        },
        where: {
          status: {
            equals: true,
          },
          ...licenseType,
          ...locationId,
        },
        orderBy: {
          name: 'asc',
        },
      });

      return NextResponse.json(asset, { status: 200 });
    } else {
      const asset = await prisma.asset.findMany({
        select: {
          id: true,
          name: true,
          plate: true,
          status: true,
          location: true,
          licenseType: true,
        },
        orderBy: {
          name: 'asc',
        },
      });

      return NextResponse.json(asset, { status: 200 });
    }
  } catch (error) {
    console.error('Error fetching assets', error);
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const asset = await prisma.asset.create({
      data: body,
    });
    revalidatePath('/assets', 'page');
    return NextResponse.json(asset, { status: 200 });
  } catch (error) {
    console.error('Creating asset', error);
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const asset = await prisma.asset.update({
      where: {
        id: body.id,
      },
      data: body,
    });
    revalidatePath('/assets', 'page');
    return NextResponse.json(asset, { status: 200 });
  } catch (error) {
    console.error('Updating asset', error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
