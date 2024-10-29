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
            const userAccess = await prisma.userAccess.findMany({
                select: {
                    id: true
                }
            });

            return NextResponse.json(userAccess, {status: 200});
        } else {
            const userAccess = await prisma.userAccess.findMany({
                select: {
                    id: true,
                },
            });

            return NextResponse.json(userAccess, {status: 200});
        }
    } catch (error) {
        console.error('Error fetching userAccesss', error);
        return NextResponse.json({error}, {status: 500});
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const userAccess = await prisma.userAccess.create({
            data: body
        });
        revalidatePath('/userAccesss', 'page')
        return NextResponse.json(userAccess, {status: 200});
    } catch (error) {
        console.error('Creating userAccess', error);
        return NextResponse.json({error}, {status: 500});
    }
}

export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const userAccess = await prisma.userAccess.update({
            where: {
                id: body.id
            },
            data: body
        });
        revalidatePath('/userAccesss', 'page')
        return NextResponse.json(userAccess, {status: 200});
    } catch (error) {
        console.error('Updating userAccess', error);
        return NextResponse.json({error}, {status: 500});
    }
}