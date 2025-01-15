import prisma from '@/lib/prisma';

export const getSchools = async () => {
    try {
        return await prisma.school.findMany({
            select: {
                id: true, name: true, schoolPrices: true, status: true
            },
            orderBy: {
                name: 'asc'
            }
        });
    } catch (error) {
        throw new Error(`Failed to get events: ${error}`);
    }
};