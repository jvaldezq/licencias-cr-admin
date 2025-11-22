import prisma from "@/lib/prisma";
import { IAsset, IAssetFilter } from '@/lib/definitions';

export const fetchAssets = async (filters?: IAssetFilter): Promise<IAsset[]> => {
  try {
    const licenseType = filters?.licenseTypeId
      ? {
          licenseTypeId: {
            equals: filters.licenseTypeId,
          },
        }
      : {};

    const locationIdFilter = filters?.locationId
      ? {
          locationId: {
            equals: filters.locationId,
          },
        }
      : {};

    const asset = await prisma.asset.findMany({
      select: {
        id: true,
        name: true,
        plate: true,
        status: true,
        location: true,
        licenseType: true,
        coolantDate: true,
        oilDate: true,
      },
      where: {
        ...licenseType,
        ...locationIdFilter,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return asset as IAsset[];
  } catch (error) {
    console.error('Error fetching assets', error);
    return [] as IAsset[];
  }
};