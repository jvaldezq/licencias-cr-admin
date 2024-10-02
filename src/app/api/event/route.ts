import prisma from '@/lib/prisma';
import {NextResponse} from 'next/server';
import {revalidatePath} from 'next/cache'
import {IEvent} from "@/lib/definitions";
import dayjs from "dayjs";

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
                        gte: startOfDay,
                        lte: endOfDay,
                    },
                },
            };
        }
        console.log(dateFilter)

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
                id: true, status: true, isMissingInfo: true, asset: {
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
                }, schedule: {
                    select: {
                        startDate: true, endDate: true,
                    }
                }, type: {
                    select: {
                        name: true, color: true,
                    }
                },
            },
            orderBy: {
                schedule: {
                    startDate: 'desc'
                }
            },
            where: {
                ...dateFilter,
                ...locationId,
                ...instructorId,
                ...licenseTypeId
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
        if (!body || !body.schedule || !body.customer || !body.payment || !body.createdById) {
            return NextResponse.json({error: 'Invalid input'}, {status: 400});
        }

        const selectedDate = dayjs(body?.schedule.startDate);
        let endDate = '';
        if (body?.schedule.endDate) {
            const [hours, minutes] = body?.schedule?.endDate?.split(':');
            endDate = selectedDate.set('hour', hours).set('minute', minutes).format('YYYY-MM-DDTHH:mm:ss');
        } else {
            endDate = dayjs(selectedDate).subtract(1, 'hour').format('YYYY-MM-DDTHH:mm:ss');
        }

        const customerPromise = prisma.customer.create({
            data: body?.customer
        })

        const eventSchedulePromise = prisma.schedule.create({
            data: {
                startDate: dayjs(selectedDate).toISOString(), endDate: dayjs(endDate).toISOString(),
            }
        })

        const paymentPromise = prisma.payment.create({
            data: {
                price: +body?.payment?.price, cashAdvance: +body?.payment?.cashAdvance, paid: body?.payment?.paid,
            }
        })

        const [customer, eventSchedule, payment] = await Promise.all([customerPromise, eventSchedulePromise, paymentPromise]);

        if (body?.assetId) {
            prisma.schedule.create({
                data: {
                    startDate: dayjs(selectedDate).toISOString(),
                    endDate: dayjs(endDate).toISOString(),
                    assetId: +body?.assetId
                }
            })
        }

        if (body?.instructorId) {
            if (body?.schedule.endDate) {
                prisma.schedule.create({
                    data: {
                        startDate: dayjs(selectedDate).toISOString(),
                        endDate: dayjs(endDate).toISOString(),
                        userId: +body?.instructorId
                    }
                })
            } else {
                prisma.schedule.create({
                    data: {
                        startDate: dayjs(endDate).toISOString(),
                        endDate: dayjs(selectedDate).toISOString(),
                        userId: +body?.instructorId
                    }
                })
            }

        }

        const eventBody = {
            status: 'CREATED',
            assetId: +body?.assetId || null,
            createdById: +body?.createdById,
            customerId: customer.id,
            instructorId: +body?.instructorId || null,
            licenseTypeId: +body?.licenseTypeId || null,
            locationId: +body?.locationId,
            paymentId: payment.id,
            scheduleId: eventSchedule.id,
            typeId: +body?.typeId,
        }

        const event = await prisma.event.create({
            data: eventBody
        });

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