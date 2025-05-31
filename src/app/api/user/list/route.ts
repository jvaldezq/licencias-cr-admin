import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

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

  const filters: Prisma.UserWhereInput[] = [];

  // Instructor filter
  if (isInstructorParam !== null) {
    filters.push({
      access: {
        instructor: {
          equals: isInstructorParam === 'true',
        },
      },
    });
  }

  // Location filter (only apply if locationId matches allowed ones)
  if (
    [
      '5c7a2198-1ec4-4111-b926-172aefbd7f1c',
      'ea54ee9e-25db-4a66-8610-c5337701e3ce',
    ].includes(locationIdParam || '')
  ) {
    filters.push({
      location: {
        id: {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          equals: locationIdParam,
        },
      },
    });
  }

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
      },
      where: {
        OR: [
          // Always include these specific users
          {
            id: {
              in: [
                '46943677-e726-43b2-a2d4-e01388ad55e2',
                'd630dbb5-fbce-46ef-aa28-2e7f30f58efe',
              ],
            },
          },
          // Apply filters if any
          ...(filters.length > 0 ? [{ AND: filters }] : []),
        ],
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
