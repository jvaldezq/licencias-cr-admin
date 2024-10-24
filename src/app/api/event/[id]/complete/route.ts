import prisma from '@/lib/prisma';
import {NextRequest, NextResponse} from "next/server";
import dayjs from "dayjs";
import {revalidatePath} from "next/cache";
import {updateClass} from "@/services/events/eventClass";
import {updateTest} from "@/services/events/eventTest";
import {eventComplete} from "@/services/events/eventComplete";

// @ts-ignore
BigInt.prototype.toJSON = function () {
    const int = Number.parseInt(this.toString());
    return int ?? this.toString();
};

export async function PATCH(_: Request, {params}: { params: { id: string } }) {
    try {
        const res = await eventComplete(+params.id);

        revalidatePath('/events', 'page')
        return NextResponse.json(res, {status: 200});
    } catch (error) {
        console.error('Completing event', error);
        return NextResponse.json({error}, {status: 500});
    }
}