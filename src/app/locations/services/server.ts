import prisma from "@/lib/prisma";
import {ILocation} from "@/lib/definitions";

export const fetchLocations = async (): Promise<ILocation[]> => {
    try {
        const locations = await prisma.location.findMany({
            select: {
                id: true,
                name: true,
                status: true,
            },
            orderBy: {
                name: 'asc'
            }
        });
        return locations as ILocation[];
    } catch (error) {
        console.error("Error fetching locations", error);
        return [] as ILocation[];
    }
};