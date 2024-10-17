import prisma from '@/lib/prisma';
import {IEvent, IEventFilter} from '@/lib/definitions';
import dayjs from 'dayjs';

export const getEventsList = async (filters: IEventFilter) => {
    try {
        const date = dayjs(filters?.date).toISOString();

        let dateFilter = {};
        if (date) {
            const startOfDay = dayjs(date).startOf('day').toISOString();
            const endOfDay = dayjs(date).endOf('day').toISOString();
            dateFilter = {
                date: {
                    gte: startOfDay, lte: endOfDay,
                },
            };
        }

        const locationId = filters?.locationId ? {
            locationId: {
                equals: +filters.locationId
            }
        } : {};

        const instructorId = filters?.instructorId ? {
            instructorId: {
                equals: +filters.instructorId
            }
        } : {};

        const licenseTypeId = filters?.licenseTypeId ? {
            licenseTypeId: {
                equals: +filters.licenseTypeId
            }
        } : {};

        const events = await prisma.event.findMany({
            select: {
                id: true, status: true, date: true, asset: {
                    select: {
                        name: true,
                    }
                }, customer: {
                    select: {
                        name: true,
                        schedule: true
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
                date: 'asc'
            }, where: {
                ...dateFilter, ...locationId, ...instructorId, ...licenseTypeId
            }
        });
        return events as unknown as IEvent[]
    } catch (error) {
        throw new Error(`Failed to create class: ${error}`);
    }
};
