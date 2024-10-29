import prisma from '@/lib/prisma';
import {NextResponse} from 'next/server';
import {revalidatePath} from 'next/cache'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
BigInt.prototype.toJSON = function () {
    const int = Number.parseInt(this.toString());
    return int ?? this.toString();
};

export async function GET() {
    try {
        const eventType = await prisma.eventType.findMany({
            select: {
                id: true,
                name: true,
            },
        });

        return NextResponse.json(eventType, {status: 200});
    } catch (error) {
        console.error('Error fetching locations', error);
        return NextResponse.json({error}, {status: 500});
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const eventType = await prisma.eventType.create({
            data: body
        });
        revalidatePath('/locations', 'page')
        return NextResponse.json(eventType, {status: 200});
    } catch (error) {
        console.error('Creating eventType', error);
        return NextResponse.json({error}, {status: 500});
    }
}

export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const eventType = await prisma.eventType.update({
            where: {
                id: body.id
            },
            data: body
        });
        revalidatePath('/locations', 'page')
        return NextResponse.json(eventType, {status: 200});
    } catch (error) {
        console.error('Updating eventType', error);
        return NextResponse.json({error}, {status: 500});
    }
}