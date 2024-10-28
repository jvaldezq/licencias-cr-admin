import {NextResponse} from 'next/server';
import {revalidatePath} from 'next/cache'
import {createClass} from "@/services/events/eventClass";
import {createTest} from "@/services/events/eventTest";
import {CLASS_TYPE, IEventFilter} from "@/lib/definitions";
import {getEventsList} from "@/services/events/getEventsList";

// @ts-ignore
BigInt.prototype.toJSON = function () {
    const int = Number.parseInt(this.toString());
    return int ?? this.toString();
};

export async function GET(request: Request) {
    try {
        const {searchParams} = new URL(request.url);
        const filtersText = searchParams.get('filters') ?? '';
        const filters = JSON.parse(atob(filtersText)) as IEventFilter;
        const events = await getEventsList(filters);

        return NextResponse.json(events, {status: 200});
    } catch (error) {
        console.error('Error fetching locations', error);
        return NextResponse.json({error}, {status: 500});
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        if (!body || !body.customer || !body.payment || !body.createdById || !body.date || !body.locationId) {
            return NextResponse.json({error: 'Invalid inputs'}, {status: 400});
        }

        let res;
        if (body?.typeId === CLASS_TYPE.CLASS) {
            res = await createClass(body);
        } else {
            res = await createTest(body);
        }

        revalidatePath('/events', 'page')
        return NextResponse.json(res, {status: 200});
    } catch (error) {
        console.error('Creating event', error);
        return NextResponse.json({error}, {status: 500});
    }
}