import prisma from '@/lib/prisma';
import { IEventForm } from '@/lib/definitions';
import dayjs from 'dayjs';

export const createClass = async (data: IEventForm) => {
    if (!data.customer) {
        throw new Error('Invalid customer data');
    }

    if (!data.payment) {
        throw new Error('Invalid payment data');
    }

    const [startTimeHours, startTimeMinutes] = data?.startTime?.split(':') || [];
    const [endTimeHours, endTimeMinutes] = data?.endTime?.split(':') || [];
    const selectedDate = dayjs(data.date);

    // Compute event, start and end dates only once
    const eventDate = selectedDate.set('hour', +startTimeHours).set('minute', +startTimeMinutes).toISOString();
    const customerStartDate = selectedDate.set('hour', +startTimeHours).set('minute', +startTimeMinutes).toISOString();
    const customerEndDate = selectedDate.set('hour', +endTimeHours).set('minute', +endTimeMinutes).toISOString();

    try {
        return await prisma.$transaction(async (prisma) => {
            const customer = await prisma.customer.create({
                data: {
                    name: data?.customer?.name || '',
                    identification: data?.customer?.identification || '',
                    phone: data?.customer?.phone || '',
                },
            });

            await prisma.schedule.create({
                data: {
                    startDate: customerStartDate,
                    endDate: customerEndDate,
                    customerId: customer.id,
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
                    status: 'Pendiente',
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
