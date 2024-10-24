import prisma from '@/lib/prisma';
import {EventStatus, IEventForm} from '@/lib/definitions';
import dayjs from 'dayjs';

export const createTest = async (data: IEventForm) => {
    if (!data.customer) {
        throw new Error('Invalid customer data');
    }

    if (!data.payment) {
        throw new Error('Invalid payment data');
    }

    const [startTimeHours, startTimeMinutes] = data?.startTime?.split(':') || [];
    const [customerStartTimeHours, customerStartTimeMinutes] = data?.customer?.schedule?.startTime?.split(':') || [];
    const selectedDate = dayjs(data.date);

    // Compute event, start and end dates only once
    const eventDate = selectedDate.set('hour', +startTimeHours).set('minute', +startTimeMinutes).toISOString();
    const customerStartDate = selectedDate.set('hour', +customerStartTimeHours).set('minute', +customerStartTimeMinutes).toISOString();
    const customerEndDate = selectedDate.set('hour', +startTimeHours).set('minute', +startTimeMinutes).add(1, 'hour').toISOString();

    try {
        return await prisma.$transaction(async (prisma) => {
            const schedule = await prisma.schedule.create({
                data: {
                    startDate: customerStartDate, endDate: customerEndDate,
                },
            });

            const customer = await prisma.customer.create({
                data: {
                    name: data?.customer?.name || '',
                    identification: data?.customer?.identification || '',
                    phone: data?.customer?.phone || '',
                    scheduleId: schedule?.id,
                },
            });


            const payment = await prisma.payment.create({
                data: {
                    price: data?.payment?.price ? +data.payment.price : 0,
                    cashAdvance: data?.payment?.cashAdvance ? +data.payment.cashAdvance : 0,
                    paid: data?.payment?.paid || false,
                },
            });

            await prisma.event.create({
                data: {
                    status: EventStatus.IN_PROGRESS,
                    assetId: data.assetId,
                    createdById: data.createdById || 0,
                    customerId: customer.id,
                    instructorId: data.instructorId,
                    licenseTypeId: data.licenseTypeId,
                    locationId: data.locationId || 0,
                    paymentId: payment.id,
                    typeId: data.typeId,
                    date: eventDate,
                },
            });

            return 'Event created successfully';
        });
    } catch (error) {
        throw new Error(`Failed to create class: ${error}`);
    }
};

export const updateTest = async (id: number, data: IEventForm): Promise<string> => {
    const [startTimeHours, startTimeMinutes] = data?.startTime?.split(':') || [];
    const [customerStartTimeHours, customerStartTimeMinutes] = data?.customer?.schedule?.startTime?.split(':') || [];
    const selectedDate = dayjs(data.date);

    // Compute event, start, and end dates only once
    const eventDate = selectedDate
        .set('hour', +startTimeHours)
        .set('minute', +startTimeMinutes)
        .toISOString();

    const customerStartDate = selectedDate
        .set('hour', +customerStartTimeHours)
        .set('minute', +customerStartTimeMinutes)
        .toISOString();

    const customerEndDate = selectedDate
        .set('hour', +startTimeHours)
        .set('minute', +startTimeMinutes)
        .add(1, 'hour')
        .toISOString();

    try {
        return await prisma.$transaction(async (prisma) => {
            const currentEvent = await prisma.event.findUnique({
                where: {id},
            })

            const customer = await prisma.customer.update({
                where: {id: currentEvent?.customerId},
                data: {
                    name: data?.customer?.name || '',
                    identification: data?.customer?.identification || '',
                    phone: data?.customer?.phone || '',
                },
            });

            if (customer?.scheduleId) {
                const schedule = await prisma.schedule.update({
                    where: {id: customer?.scheduleId},
                    data: {
                        startDate: customerStartDate, endDate: customerEndDate,
                    },
                });
            }


            const payment = await prisma.payment.update({
                where: {id: currentEvent?.paymentId},
                data: {
                    price: data?.payment?.price ? +data.payment.price : 0,
                    cashAdvance: data?.payment?.cashAdvance ? +data.payment.cashAdvance : 0,
                    paid: data?.payment?.paid || false,
                },
            });

            await prisma.event.update({
                where: {id},
                data: {
                    status: EventStatus.IN_PROGRESS,
                    assetId: data.assetId,
                    createdById: data.createdById || 0,
                    customerId: customer.id,
                    instructorId: data.instructorId,
                    licenseTypeId: data.licenseTypeId,
                    locationId: data.locationId || 0,
                    paymentId: payment.id,
                    typeId: data.typeId,
                    date: eventDate,
                },
            });

            return 'Event updated successfully';
        });
    } catch (error) {
        throw new Error(`Failed to update event type test: ${error}`);
    }
};
