import prisma from '@/lib/prisma';
import { EventStatus, IEventForm, LOG_TITLES } from '@/lib/definitions';
import dayjs from 'dayjs';
import { logEvent } from '@/services/logs/logEvent';

export const createTest = async (data: IEventForm) => {
  if (!data.customer) {
    throw new Error('Invalid customer data');
  }

  if (!data.payment) {
    throw new Error('Invalid payment data');
  }

  const [startTimeHours, startTimeMinutes] = data?.startTime?.split(':') || [];
  const [customerStartTimeHours, customerStartTimeMinutes] =
    data?.customer?.schedule?.startTime?.split(':') || [];
  const selectedDate = dayjs(data.date);

  // Compute event, start and end dates only once
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

  const updatedTime = selectedDate
    .set('hour', +customerStartTimeHours)
    .set('minute', +customerStartTimeMinutes)
    .add(1, 'hour')
    .format('HH:mm');

  try {
    return await prisma.$transaction(async (prisma) => {
      const schedule = await prisma.schedule.create({
        data: {
          startDate: customerStartDate,
          endDate: customerEndDate,
          startTime: data?.customer?.schedule?.startTime || '',
          endTime: updatedTime || '',
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
          time: data.startTime,
          notes: data.notes,
          hasMedical: data.hasMedical,
          isExternalReferred: data.isExternalReferred,
          isInternalReferred: data.isInternalReferred,
        },
      });

      return 'Event created successfully';
    });
  } catch (error) {
    throw new Error(`Failed to create class: ${error}`);
  }
};

export const updateTest = async (
  id: string,
  data: IEventForm,
): Promise<string> => {
  const [startTimeHours, startTimeMinutes] = data?.startTime?.split(':') || [];
  const [customerStartTimeHours, customerStartTimeMinutes] =
    data?.customer?.schedule?.startTime?.split(':') || [];
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

  const updatedTime = selectedDate
    .set('hour', +customerStartTimeHours)
    .set('minute', +customerStartTimeMinutes)
    .add(1, 'hour')
    .format('HH:mm');

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
            startTime: data?.customer?.schedule?.startTime || '',
            endTime: updatedTime || '',
          },
        });
      }

      const payment = await prisma.payment.update({
        where: { id: currentEvent?.paymentId },
        data: {
          price: data?.payment?.price ? +data.payment.price : 0,
          cashAdvance: data?.payment?.cashAdvance
            ? +data.payment.cashAdvance
            : 0,
        },
      });

      const event = await prisma.event.update({
        where: { id },
        select: {
          id: true,
          type: {
            select: {
              name: true,
            },
          },
          notes: true,
          customer: {
            select: {
              name: true,
              identification: true,
              phone: true,
              schedule: {
                select: {
                  startTime: true,
                  endTime: true,
                },
              },
              testPassed: true,
            },
          },
          location: {
            select: {
              name: true,
            },
          },
          licenseType: {
            select: {
              name: true,
            },
          },
          date: true,
          time: true,
          instructor: {
            select: {
              name: true,
            },
          },
          asset: {
            select: {
              name: true,
            },
          },
          createdById: true,
          payment: {
            select: {
              price: true,
              cashAdvance: true,
              paid: true,
              paidDate: true,
              cashPaymentsAdvance: true,
            },
          },
          hasMedical: true,
          isInternalReferred: true,
          isExternalReferred: true,
        },
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
        message: JSON.stringify(event),
        eventId: event.id,
      });

      return 'Event updated successfully';
    });
  } catch (error) {
    throw new Error(`Failed to update event type test: ${error}`);
  }
};
