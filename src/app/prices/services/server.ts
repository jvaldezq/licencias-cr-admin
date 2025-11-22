import prisma from "@/lib/prisma";
import { IBasePrice, IPriceFilter } from '@/lib/definitions';

export const fetchPrices = async (filters?: IPriceFilter): Promise<IBasePrice[]> => {
  try {
    const locationIdFilter = filters?.locationId
      ? {
          locationId: {
            equals: filters.locationId,
          },
        }
      : {};

    const prices = await prisma.basePrice.findMany({
      select: {
        id: true,
        note: true,
        description: true,
        priceClient: true,
        priceSchool: true,
        location: true,
      },
      where: {
        ...locationIdFilter,
      },
    });

    return prices as IBasePrice[];
  } catch (error) {
    console.error('Error fetching prices', error);
    return [] as IBasePrice[];
  }
};