import {serverApi} from "@/lib/serverApi";
import { IAsset, IAssetFilter } from '@/lib/definitions';

export const fetchAssets = async (filters?: IAssetFilter): Promise<IAsset[]> => {
  try {
    const response = await serverApi({
      method: 'GET',
      path: '/asset',
      params: filters,
    });
    return response as IAsset[];
  } catch (error) {
    console.error('Error fetching assets', error);
    return [] as IAsset[];
  }
};