import prisma from '@/lib/prisma';

export const getLicenseTypes = async () => {
    try {
        return await prisma.licenseType.findMany({
            select: {
                id: true, name: true
            },
            orderBy: {
                name: 'asc'
            }
        });
    } catch (error) {
        throw new Error(`Failed to get license types: ${error}`);
    }
};