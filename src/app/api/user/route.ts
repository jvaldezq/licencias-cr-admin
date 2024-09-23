import prisma from '@/lib/prisma';
import {NextResponse} from 'next/server';

// @ts-ignore
BigInt.prototype.toJSON = function () {
    const int = Number.parseInt(this.toString());
    return int ?? this.toString();
};

export async function GET(request: Request) {
    const {searchParams} = new URL(request.url);
    const userId = searchParams.get('userId') || '';

    try {
        const user = await prisma.user.findFirst({
            select: {
                id: true, name: true, location: true, access: true,
            }, where: {
                authId: {
                    equals: userId
                },
            },
        });

        return NextResponse.json(user, {status: 200});
    } catch (error) {
        console.log('Error fetching user', error);
        return NextResponse.json({error}, {status: 500});
    }
}