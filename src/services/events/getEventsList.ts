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
                equals: filters.locationId
            }
        } : undefined;

        const instructorId = filters?.instructorId ? {
            instructorId: {
                equals: filters.instructorId,
            }
        } : undefined;

        const licenseTypeId = filters?.licenseTypeId ? {
            licenseTypeId: {
                equals: filters.licenseTypeId,
            }
        } : undefined;

        const events = await prisma.event.findMany({
            select: {
                id: true,
                status: true,
                date: true,
                time: true,
                notes: true,
                asset: {
                    select: {
                        id: true,
                        name: true,
                        locationId: true,
                    }
                },
                customer: {
                    select: {
                        name: true, schedule: true
                    }
                },
                instructor: true,
                licenseType: {
                    select: {
                        name: true, color: true,
                    }
                },
                type: {
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
                isReferred: {
                    equals: false
                },
                customer: {
                    OR: [
                        { name: { contains: filters?.searchTerm || '', mode: 'insensitive' } },
                        { phone: { contains: filters?.searchTerm || '', mode: 'insensitive' } },
                        { identification: { contains: filters?.searchTerm || '', mode: 'insensitive' } }
                    ]
                }
            }
        });
        return events as unknown as IEvent[]
    } catch (error) {
        throw new Error(`Failed to get events: ${error}`);
    }
};

export const getEventsReferredList = async (filters: IEventFilter) => {
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

        const events = await prisma.event.findMany({
            select: {
                id: true,
                status: true,
                date: true,
                time: true,
                notes: true,
                location: {
                    select: {
                        name: true,
                    }
                },
                asset: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
                customer: {
                    select: {
                        name: true, schedule: true
                    }
                },
                instructor: true,
                licenseType: {
                    select: {
                        name: true, color: true,
                    }
                },
                type: {
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
                status: {
                    in: [EventStatus.IN_PROGRESS, EventStatus.COMPLETED]
                },
                isReferred: {
                    equals: true
                }
            }
        });
        return events as unknown as IEvent[]
    } catch (error) {
        throw new Error(`Failed to get referred events: ${error}`);
    }
};
