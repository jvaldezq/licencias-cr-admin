import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from "next/server";

// @ts-ignore
BigInt.prototype.toJSON = function () {
    const int = Number.parseInt(this.toString());
    return int ?? this.toString();
};

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const location = await prisma.location.findUnique({
            where: {
                id: Number(params.id)
            }
        });
        return NextResponse.json(location, {status: 200});
    } catch (error) {
        console.log('Error fetching location', error);
        return NextResponse.json({error}, {status: 500});
    }
}