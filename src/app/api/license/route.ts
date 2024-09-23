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
        const user = await prisma.licenseType.findMany({
            select: {
                id: true,
                name: true,
                color: true,
            },
        });

        return NextResponse.json(user, {status: 200});
    } catch (error) {
        console.log('Error fetching license types', error);
        return NextResponse.json({error}, {status: 500});
    }
}