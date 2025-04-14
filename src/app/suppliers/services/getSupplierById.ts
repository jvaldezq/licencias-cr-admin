import { ISupplier } from '@/lib/definitions';
import { clientApi } from '@/lib/clientApi';
import { useQuery } from 'react-query';

const getSupplierById = async (id: string): Promise<ISupplier> => {
  const supplier = await clientApi.get(`/supplier/${id}`);
  return supplier.data;
};

export const useGetSupplierById = (id: string) => {
  return useQuery({
    enabled: !!id,
    refetchOnWindowFocus: false,
    queryKey: ['supplier-by-id', id],
    queryFn: () => getSupplierById(id),
    retry: 2,
  });
};
