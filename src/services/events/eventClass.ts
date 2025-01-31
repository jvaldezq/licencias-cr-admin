import prisma from '@/lib/prisma';
import { EventStatus, IEventForm, LOG_TITLES } from '@/lib/definitions';
import dayjs from 'dayjs';
import { logEvent } from '@/services/logs/logEvent';
import { getChanges } from '@/lib/logging.utils';

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

      await prisma.event.create({
        data: {
          status: EventStatus.PENDING,
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
          isExternalReferred: data.isExternalReferred,
          isInternalReferred: data.isInternalReferred,
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

      const customerChanges = await getChanges(
        prisma.customer,
        currentEvent?.customerId || '',
        {
          name: data?.customer?.name || '',
          identification: data?.customer?.identification || '',
          phone: data?.customer?.phone || '',
        },
      );

      const customer = await prisma.customer.update({
        where: { id: currentEvent?.customerId },
        data: {
          name: data?.customer?.name || '',
          identification: data?.customer?.identification || '',
          phone: data?.customer?.phone || '',
        },
      });

      const scheduleChanges = await getChanges(
        prisma.schedule,
        customer?.scheduleId || '',
        {
          startDate: customerStartDate,
          endDate: customerEndDate,
          startTime: data?.startTime || '',
          endTime: data?.endTime || '',
        },
      );

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

      const paymentChanges = await getChanges(
        prisma.payment,
        currentEvent?.paymentId || '',
        {
          price: data?.payment?.price ? +data.payment.price : 0,
          cashAdvance: data?.payment?.cashAdvance
            ? +data.payment.cashAdvance
            : 0,
        },
      );

      const payment = await prisma.payment.update({
        where: { id: currentEvent?.paymentId },
        data: {
          price: data?.payment?.price ? +data.payment.price : 0,
        },
      });

      const eventChanges = await getChanges(prisma.event, id || '', {
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
        isExternalReferred: data.isExternalReferred,
        isInternalReferred: data.isInternalReferred,
      });

      const event = await prisma.event.update({
        where: { id },
        data: {
          assetId: data.assetId,
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
          isExternalReferred: data.isExternalReferred,
          isInternalReferred: data.isInternalReferred,
        },
      });

      await logEvent({
        title: LOG_TITLES.UPDATED,
        message: JSON.stringify({
          ...customerChanges,
          ...scheduleChanges,
          ...paymentChanges,
          ...eventChanges,
        }),
        eventId: event.id,
      });

      return 'Event updated successfully';
    });
  } catch (error) {
    throw new Error(`Failed to update event type class: ${error}`);
  }
};
