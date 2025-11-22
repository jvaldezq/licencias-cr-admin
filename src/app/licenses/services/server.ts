import prisma from "@/lib/prisma";
import {ILicenseType} from "@/lib/definitions";

export const fetchLicenses = async (): Promise<ILicenseType[]> => {
    try {
        const licenses = await prisma.licenseType.findMany({
            select: {
                id: true,
                name: true,
                color: true,
            },
            orderBy: {
                name: 'asc'
            }
        });
        return licenses as ILicenseType[];
    } catch (error) {
        console.error("Error fetching licenses", error);
        return [] as ILicenseType[];
    }
};