import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();
import {NextResponse} from 'next/server';

// @ts-ignore
BigInt.prototype.toJSON = function () {
    const int = Number.parseInt(this.toString());
    return int ?? this.toString();
};

export async function GET(request: Request) {
    try {
        const user = await prisma.asset.findMany({
            select: {
                id: true,
                name: true,
                plate: true,
                status: true,
                location: true,
            },
        });

        return NextResponse.json(user, {status: 200});
    } catch (error) {
        console.log('Error fetching assets', error);
        return NextResponse.json({error}, {status: 500});
    }
}