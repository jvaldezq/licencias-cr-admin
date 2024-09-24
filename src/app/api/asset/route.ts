import {NextResponse} from 'next/server';
import prisma from '@/lib/prisma';
import {revalidatePath} from "next/cache";

// @ts-ignore
BigInt.prototype.toJSON = function () {
    const int = Number.parseInt(this.toString());
    return int ?? this.toString();
};

export async function GET(request: Request) {
    try {
        const user = await prisma.asset.findMany({
            select: {
                id: true, name: true, plate: true, status: true, location: true,
            },
        });

        return NextResponse.json(user, {status: 200});
    } catch (error) {
        console.error('Error fetching assets', error);
        return NextResponse.json({error}, {status: 500});
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const asset = await prisma.asset.create({
            data: body
        });
        revalidatePath('/assets', 'page')
        return NextResponse.json(asset, {status: 200});
    } catch (error) {
        console.error('Creating asset', error);
        return NextResponse.json({error}, {status: 500});
    }
}

export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const asset = await prisma.asset.update({
            where: {
                id: body.id
            },
            data: body
        });
        revalidatePath('/assets', 'page')
        return NextResponse.json(asset, {status: 200});
    } catch (error) {
        console.error('Updating asset', error);
        return NextResponse.json({error}, {status: 500});
    }
}