import prisma from '@/lib/prisma';
import { EventStatus, IEventForm } from '@/lib/definitions';
import dayjs from 'dayjs';

export const createClass = async (data: IEventForm) => {
  const [startTimeHours, startTimeMinutes] = data?.startTime?.split(':') || [];
  const [endTimeHours, endTimeMinutes] = data?.endTime?.split(':') || [];
  const selectedDate = dayjs(data.date);

  // Compute event, start and end dates only once
  const eventDate = selectedDate
    .set('hour', +startTimeHours)
    .set('minute', +startTimeMinutes)
    .toISOString();
  const customerStartDate = selectedDate
    .set('hour', +startTimeHours)
    .set('minute', +startTimeMinutes)
    .toISOString();
  const customerEndDate = selectedDate
    .set('hour', +endTimeHours)
    .set('minute', +endTimeMinutes)
    .toISOString();

  try {
    return await prisma.$transaction(async (prisma) => {
      const schedule = await prisma.schedule.create({
        data: {
          startDate: customerStartDate,
          endDate: customerEndDate,
          startTime: data?.startTime || '',
          endTime: data?.endTime || '',
        },
      });

      const customer = await prisma.customer.create({
        data: {
          name: data?.customer?.name || '',
          identification: data?.customer?.identification || '',
          phone: data?.customer?.phone || '',
          scheduleId: schedule.id,
        },
      });

      const payment = await prisma.payment.create({
        data: {
          price: data?.payment?.price ? +data.payment.price : 0,
          cashAdvance: data?.payment?.cashAdvance
            ? +data.payment.cashAdvance
            : 0,
        },
      });

      await prisma.cashPaymentsAdvance.create({
        data: {
          amount: data?.payment?.cashAdvance ? +data.payment.cashAdvance : 0,
          userId: data.createdById || '',
          paymentId: payment?.id || '',
          type: data?.payment?.type || '',
        },
      });

      const status =
        data?.payment?.price === data?.payment?.cashAdvance
          ? EventStatus.PAID
          : EventStatus.PENDING;

      await prisma.event.create({
        data: {
          status: status,
          assetId: data.assetId,
          createdById: data.createdById || '',
          customerId: customer.id,
          instructorId: data.instructorId,
          licenseTypeId: data.licenseTypeId,
          locationId: data.locationId || '',
          paymentId: payment.id,
          typeId: data.typeId,
          date: eventDate,
          time: data?.startTime,
          notes: data.notes,
          hasMedical: data.hasMedical,
        },
      });

      return 'Event created successfully';
    });
  } catch (error) {
    throw new Error(`Failed to create event type class: ${error}`);
  }
};

export const updateClass = async (
  id: string,
  data: IEventForm,
): Promise<string> => {
  const [startTimeHours, startTimeMinutes] = data?.startTime?.split(':') || [];
  const [endTimeHours, endTimeMinutes] = data?.endTime?.split(':') || [];
  const selectedDate = dayjs(data.date);

  // Compute event, start and end dates only once
  const eventDate = selectedDate
    .set('hour', +startTimeHours)
    .set('minute', +startTimeMinutes)
    .toISOString();
  const customerStartDate = selectedDate
    .set('hour', +startTimeHours)
    .set('minute', +startTimeMinutes)
    .toISOString();
  const customerEndDate = selectedDate
    .set('hour', +endTimeHours)
    .set('minute', +endTimeMinutes)
    .toISOString();

  try {
    return await prisma.$transaction(async (prisma) => {
      const currentEvent = await prisma.event.findUnique({
        where: { id },
      });

      const customer = await prisma.customer.update({
        where: { id: currentEvent?.customerId },
        data: {
          name: data?.customer?.name || '',
          identification: data?.customer?.identification || '',
          phone: data?.customer?.phone || '',
        },
      });

      if (customer?.scheduleId) {
        await prisma.schedule.update({
          where: { id: customer?.scheduleId },
          data: {
            startDate: customerStartDate,
            endDate: customerEndDate,
            startTime: data?.startTime || '',
            endTime: data?.endTime || '',
          },
        });
      }

      const payment = await prisma.payment.update({
        where: { id: currentEvent?.paymentId },
        data: {
          price: data?.payment?.price ? +data.payment.price : 0,
        },
      });

      await prisma.event.update({
        where: { id },
        data: {
          assetId: data.assetId,
          createdById: data.createdById || '',
          customerId: customer.id,
          instructorId: data.instructorId,
          licenseTypeId: data.licenseTypeId,
          locationId: data.locationId || '',
          paymentId: payment.id,
          typeId: data.typeId,
          date: eventDate,
          time: data.startTime,
          notes: data.notes,
          hasMedical: data.hasMedical,
        },
      });

      return 'Event updated successfully';
    });
  } catch (error) {
    throw new Error(`Failed to update event type class: ${error}`);
  }
};
