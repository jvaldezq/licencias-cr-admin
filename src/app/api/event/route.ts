import prisma from '@/lib/prisma';
import {NextResponse} from 'next/server';
import {revalidatePath} from 'next/cache'

// @ts-ignore
BigInt.prototype.toJSON = function () {
    const int = Number.parseInt(this.toString());
    return int ?? this.toString();
};

export async function GET(request: Request) {
    try {
        // const {searchParams} = new URL(request.url);
        // const listParams = searchParams.get('list');

        const event = await prisma.event.findMany({
            select: {
                id: true,
                customerName: true,
                customerId: true,
                phone: true,
                price: true,
                cashAdvance: true,
                date: true,
                endDate: true,
                customerPass: true,
                paid: true,
                customerPaidDate: true,
                status: true,
                location: true,
                instructor: true,
                createdBy: true,
            },
        });

        return NextResponse.json(event, {status: 200});
    } catch (error) {
        console.error('Error fetching locations', error);
        return NextResponse.json({error}, {status: 500});
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const event = await prisma.event.create({
            data: body
        });
        revalidatePath('/locations', 'page')
        return NextResponse.json(event, {status: 200});
    } catch (error) {
        console.error('Creating event', error);
        return NextResponse.json({error}, {status: 500});
    }
}

export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const event = await prisma.event.update({
            where: {
                id: body.id
            },
            data: body
        });
        revalidatePath('/locations', 'page')
        return NextResponse.json(event, {status: 200});
    } catch (error) {
        console.error('Updating event', error);
        return NextResponse.json({error}, {status: 500});
    }
}