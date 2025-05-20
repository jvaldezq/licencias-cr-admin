import { IPrice, ILocation } from '@/lib/definitions';
import { clientApi } from '@/lib/clientApi';
import { useMutation, useQuery } from 'react-query';
import { PriceFormProps } from '@/app/prices/forms/PriceForm';

const createPrice = async (data: PriceFormProps): Promise<IPrice> => {
  const price = await clientApi.post('/price', data);
  return price.data;
};

const updatePrice = async (data: PriceFormProps): Promise<IPrice> => {
  const price = await clientApi.patch('/price', data);
  return price.data;
};

const getLocationList = async (): Promise<ILocation[]> => {
  const locationList = await clientApi.get('/location', {
    params: {
      list: true,
    },
  });
  return locationList.data;
};

const getPriceById = async (id: string): Promise<IPrice> => {
  const location = await clientApi.get(`/price/${id}`);
  return location.data;
};

const deletePrice = async (id: string): Promise<IPrice> => {
  const price = await clientApi.delete(`/price/${id}`);
  return price.data;
};

export const useGetLocationList = () => {
  return useQuery({
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    queryKey: ['location-list'],
    queryFn: getLocationList,
    retry: 2,
  });
};

export const useCreateMutation = () => {
  return useMutation({
    mutationFn: (data: PriceFormProps) => {
      return createPrice(data);
    },
    mutationKey: ['price-create'],
  });
};

export const useUpdateMutation = () => {
  return useMutation({
    mutationFn: (data: PriceFormProps) => {
      return updatePrice(data);
    },
    mutationKey: ['price-update'],
  });
};

export const useGetPriceById = (id: string) => {
  return useQuery({
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    queryKey: ['price-by-id', id],
    queryFn: () => getPriceById(id),
    retry: 2,
  });
};

export const useDeleteMutation = () => {
  return useMutation({
    mutationFn: (id: string) => {
      return deletePrice(id);
    },
    mutationKey: ['price-delete'],
  });
};
