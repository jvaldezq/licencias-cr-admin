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
  const isInstructorParam = searchParams.get('isInstructor');
  const locationIdParam = searchParams.get('locationId');

  const isInstructor = isInstructorParam
    ? {
        access: {
          instructor: {
            equals: isInstructorParam === 'true',
          },
        },
      }
    : {};

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

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
      },
      where: {
        ...isInstructor,
        ...locationId,
      },
    });

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 },
    );
  }
}
