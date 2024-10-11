import prisma from '@/lib/prisma';
import {NextResponse} from 'next/server';
import {revalidatePath} from 'next/cache'
import dayjs from "dayjs";
import {createClass} from "@/services/events/createClass";
import {createTest} from "@/services/events/createTest";

// @ts-ignore
BigInt.prototype.toJSON = function () {
    const int = Number.parseInt(this.toString());
    return int ?? this.toString();
};

export async function GET(request: Request) {
    try {
        const {searchParams} = new URL(request.url);
        const date = searchParams.get('date');
        const locationIdParam = searchParams.get('locationId');
        const instructorIdParam = searchParams.get('instructorId');
        const licenseTypeIdParam = searchParams.get('licenseTypeId');

        let dateFilter = {};
        if (date) {
            const startOfDay = dayjs(date).startOf('day').toISOString();
            const endOfDay = dayjs(date).endOf('day').toISOString();
            dateFilter = {
                schedule: {
                    startDate: {
                        gte: startOfDay, lte: endOfDay,
                    },
                },
            };
        }

        const locationId = locationIdParam ? {
            locationId: {
                equals: +locationIdParam
            }
        } : {};

        const instructorId = instructorIdParam ? {
            instructorId: {
                equals: +instructorIdParam
            }
        } : {};

        const licenseTypeId = licenseTypeIdParam ? {
            licenseTypeId: {
                equals: +licenseTypeIdParam
            }
        } : {};

        const event = await prisma.event.findMany({
            select: {
                id: true, status: true, isMissingInfo: true, date: true, asset: {
                    select: {
                        name: true,
                    }
                }, customer: {
                    select: {
                        name: true,
                    }
                }, instructor: true, licenseType: {
                    select: {
                        name: true, color: true,
                    }
                }, type: {
                    select: {
                        name: true, color: true,
                    }
                },
            }, orderBy: {
                // date: 'desc'
            }, where: {
                ...dateFilter, ...locationId, ...instructorId, ...licenseTypeId
            }
        });

        return NextResponse.json(event, {status: 200});
    } catch (error) {
        console.error('Error fetching locations', error);
        return NextResponse.json({error}, {status: 500});
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        if (!body || !body.customer || !body.payment || !body.createdById || !body.date  || !body.locationId) {
            return NextResponse.json({error: 'Invalid inputs'}, {status: 400});
        }

        const event = body?.endDate ? await createClass(body) : await createTest(body);


        revalidatePath('/events', 'page')
        return NextResponse.json(event, {status: 200});
    } catch (error) {
        console.error('Creating event', error);
        return NextResponse.json({error}, {status: 500});
    }
}

export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const event = await prisma.event.update({
            where: {
                id: body.id
            }, data: body
        });
        revalidatePath('/locations', 'page')
        return NextResponse.json(event, {status: 200});
    } catch (error) {
        console.error('Updating event', error);
        return NextResponse.json({error}, {status: 500});
    }
}