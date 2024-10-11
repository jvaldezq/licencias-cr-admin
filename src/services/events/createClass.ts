import prisma from '@/lib/prisma';
import {IEventForm} from "@/lib/definitions";
import dayjs from "dayjs";

export const createClass = async (data: IEventForm) => {
    if (!data?.customer) {
        throw new Error('Invalid customer data');
    }

    const [startTimeHours, startTimeMinutes] = data?.startTime?.split(':') || [];
    const [endTimeHours, endTimeMinutes] = data?.endTime?.split(':') || [];
    const selectedDate = dayjs(data?.date);
    const eventDate = dayjs(selectedDate?.set('hour', +startTimeHours).set('minute', +startTimeMinutes).format('YYYY-MM-DDTHH:mm:ss')).toISOString();
    const customerStartDate = dayjs(selectedDate?.set('hour', +startTimeHours).set('minute', +startTimeMinutes).format('YYYY-MM-DDTHH:mm:ss')).toISOString();
    const customerEndDate = dayjs(selectedDate?.set('hour', +endTimeHours).set('minute', +endTimeMinutes).format('YYYY-MM-DDTHH:mm:ss')).toISOString();

    const customer = await prisma.customer.create({
        data: {
            name: data?.customer?.name || '',
            identification: data?.customer.identification || '',
            phone: data?.customer.phone || '',
        }
    })

    prisma.schedule.create({
        data: {
            startDate: customerStartDate, endDate: customerEndDate, customerId: customer?.id,
        }
    })

    if (!data?.payment) {
        throw new Error('Invalid payment data');
    }

    const payment = await prisma.payment.create({
        data: {
            price: data?.payment?.price ? +data?.payment?.price : 0,
            cashAdvance: data?.payment?.cashAdvance ? +data?.payment?.cashAdvance : 0,
            paid: data?.payment?.paid || false,
        }
    });

    return prisma.event.create({
        data: {
            status: 'Pendiente',
            assetId: data?.assetId,
            createdById: data?.createdById || 0,
            customerId: customer?.id,
            instructorId: data?.instructorId,
            licenseTypeId: data?.licenseTypeId,
            locationId: data?.locationId || 0,
            paymentId: payment?.id,
            typeId: data?.typeId,
            date: eventDate,
        }
    });
}