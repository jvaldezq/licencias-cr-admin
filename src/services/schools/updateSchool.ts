import prisma from '@/lib/prisma';
import { ISchool } from "@/lib/definitions";

export const updateSchool = async (id: string, data: ISchool) => {
    return prisma.school.update({
        where: { id },
        data: {
            name: data.name,
            status: data.status,
            schoolPrices: {
                upsert: data.schoolPrices.map(price => ({
                    where: {
                        id: price.id,
                    },
                    update: {
                        internalPrice: price.internalPrice,
                        externalPrice: price.externalPrice,
                    },
                    create: {
                        licenseTypeId: price.licenseTypeId,
                        internalPrice: price.internalPrice,
                        externalPrice: price.externalPrice,
                    },
                })),
            },
        },
    });
};
