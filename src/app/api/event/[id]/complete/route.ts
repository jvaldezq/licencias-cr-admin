import {NextResponse} from "next/server";
import {revalidatePath} from "next/cache";
import {eventComplete} from "@/services/events/eventComplete";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
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