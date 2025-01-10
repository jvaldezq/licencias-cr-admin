import prisma from '@/lib/prisma';
import {ISchool} from "@/lib/definitions";

export const createSchool = async (data: ISchool) => {
    return prisma.school.create({
        data: {
            name: data.name, status: data.status, schoolPrices: {
                create: data.schoolPrices.map(price => ({
                    licenseTypeId: price.licenseTypeId,
                    internalPrice: price.internalPrice,
                    externalPrice: price.externalPrice,
                })),
            },
        },
    });
};