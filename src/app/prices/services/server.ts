import {serverApi} from "@/lib/serverApi";
import { IBasePrice, IPriceFilter } from '@/lib/definitions';

export const fetchPrices = async (filters?: IPriceFilter): Promise<IBasePrice[]> => {
  try {
    const response = await serverApi({
      method: 'GET',
      path: '/price',
      params: filters,
    });
    return response as IBasePrice[];
  } catch (error) {
    console.error('Error fetching prices', error);
    return [] as IBasePrice[];
  }
};