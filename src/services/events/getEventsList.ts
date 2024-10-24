import prisma from '@/lib/prisma';
import {EventStatus, IEvent, IEventFilter} from '@/lib/definitions';
import dayjs from 'dayjs';

export const getEventsList = async (filters: IEventFilter) => {
    try {
        let date = dayjs(new Date()).toISOString();
        if (filters?.date) {
            date = dayjs(filters?.date).toISOString();
        }

        let dateFilter = {};
        const startOfDay = dayjs(date).startOf('day').toISOString();
        const endOfDay = dayjs(date).endOf('day').toISOString();
        dateFilter = {
            date: {
                gte: startOfDay, lte: endOfDay,
            },
        };

        const locationId = filters?.locationId ? {
            locationId: {
                equals: BigInt(filters.locationId)
            }
        } : undefined;

        const instructorId = filters?.instructorId ? {
            instructorId: {
                equals: BigInt(filters.instructorId),
            }
        } : undefined;

        const licenseTypeId = filters?.licenseTypeId ? {
            licenseTypeId: {
                equals: BigInt(filters.licenseTypeId),
            }
        } : undefined;

        const events = await prisma.event.findMany({
            select: {
                id: true, status: true, date: true, asset: {
                    select: {
                        name: true,
                    }
                }, customer: {
                    select: {
                        name: true, schedule: true
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
            },
            orderBy: {
                date: 'asc'
            },
            where: {
                ...dateFilter,
                ...locationId,
                ...instructorId,
                ...licenseTypeId,
                status: {
                    equals: EventStatus.IN_PROGRESS
                }
            }
        });
        return events as unknown as IEvent[]
    } catch (error) {
        throw new Error(`Failed to get events: ${error}`);
    }
};
