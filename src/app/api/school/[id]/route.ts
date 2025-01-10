import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from "next/server";
import {revalidatePath} from "next/cache";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
BigInt.prototype.toJSON = function () {
    const int = Number.parseInt(this.toString());
    return int ?? this.toString();
};

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const school = await prisma.school.findUnique({
            where: {
                id: params.id
            },
            select: {
                id: true,
                name: true,
                status: true,
                schoolPrices: true
            }
        });
        return NextResponse.json(school, {status: 200});
    } catch (error) {
        console.log('Error fetching school', error);
        return NextResponse.json({error}, {status: 500});
    }
}

export async function DELETE(req: NextRequest, {params}: { params: { id: string } }) {
    try {
        const school = await prisma.school.delete({
            where: {
                id: params.id
            }
        });
        revalidatePath('/school', 'page')
        return NextResponse.json(school, {status: 200});
    } catch (error) {
        console.log('Error deleting school', error);
        return NextResponse.json({error}, {status: 500});
    }
}