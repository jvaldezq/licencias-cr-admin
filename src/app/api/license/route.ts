import prisma from '@/lib/prisma';
import {NextResponse} from 'next/server';
import {revalidatePath} from "next/cache";

// @ts-ignore
BigInt.prototype.toJSON = function () {
    const int = Number.parseInt(this.toString());
    return int ?? this.toString();
};

export async function GET(request: Request) {
    try {
        const {searchParams} = new URL(request.url);
        const listParams = searchParams.get('list');

        if (listParams) {
            const location = await prisma.licenseType.findMany({
                select: {
                    id: true, name: true,
                }
            });

            return NextResponse.json(location, {status: 200});
        } else {
            const user = await prisma.licenseType.findMany({
                select: {
                    id: true, name: true, color: true,
                },
            });

            return NextResponse.json(user, {status: 200});
        }
    } catch (error) {
        console.error('Error fetching license types', error);
        return NextResponse.json({error}, {status: 500});
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const license = await prisma.licenseType.create({
            data: body
        });
        revalidatePath('/licenses', 'page')
        return NextResponse.json(license, {status: 200});
    } catch (error) {
        console.error('Creating license', error);
        return NextResponse.json({error}, {status: 500});
    }
}

export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const license = await prisma.licenseType.update({
            where: {
                id: body.id
            }, data: body
        });
        revalidatePath('/licenses', 'page')
        return NextResponse.json(license, {status: 200});
    } catch (error) {
        console.error('Updating license', error);
        return NextResponse.json({error}, {status: 500});
    }
}