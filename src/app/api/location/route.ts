import prisma from '@/lib/prisma';
import {NextResponse} from 'next/server';
import {revalidatePath} from 'next/cache'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
BigInt.prototype.toJSON = function () {
    const int = Number.parseInt(this.toString());
    return int ?? this.toString();
};

export async function GET(request: Request) {
    try {
        const {searchParams} = new URL(request.url);
        const listParams = searchParams.get('list');

        if (listParams) {
            const location = await prisma.location.findMany({
                select: {
                    id: true, name: true,
                }, where: {
                    status: {
                        equals: true
                    }
                },
                orderBy: {
                    name: 'asc'
                }
            });

            return NextResponse.json(location, {status: 200});
        } else {
            const location = await prisma.location.findMany({
                select: {
                    id: true, name: true, status: true,
                },
                orderBy: {
                    name: 'asc'
                }
            });

            return NextResponse.json(location, {status: 200});
        }
    } catch (error) {
        console.error('Error fetching locations', error);
        return NextResponse.json({error}, {status: 500});
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const location = await prisma.location.create({
            data: body
        });
        revalidatePath('/locations', 'page')
        return NextResponse.json(location, {status: 200});
    } catch (error) {
        console.error('Creating location', error);
        return NextResponse.json({error}, {status: 500});
    }
}

export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const location = await prisma.location.update({
            where: {
                id: body.id
            },
            data: body
        });
        revalidatePath('/locations', 'page')
        return NextResponse.json(location, {status: 200});
    } catch (error) {
        console.error('Updating location', error);
        return NextResponse.json({error}, {status: 500});
    }
}