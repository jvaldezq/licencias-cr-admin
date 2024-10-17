import prisma from '@/lib/prisma';
import {NextResponse} from 'next/server';

// @ts-ignore
BigInt.prototype.toJSON = function () {
    const int = Number.parseInt(this.toString());
    return int ?? this.toString();
};

export async function GET(request: Request) {
    const {searchParams} = new URL(request.url);
    const isInstructorParam = searchParams.get('isInstructor');
    const locationIdParam = searchParams.get('locationId');

    const isInstructor = isInstructorParam ? {
        access: {
            instructor: {
                equals: isInstructorParam === 'true',
            }
        }
    } : {};

    const locationId = locationIdParam ? {
        location: {
            id: {
                equals: parseInt(locationIdParam, 10),
            }
        }
    } : {};

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

        return NextResponse.json(users, {status: 200});
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({error: 'Failed to fetch users'}, {status: 500});
    }
}
