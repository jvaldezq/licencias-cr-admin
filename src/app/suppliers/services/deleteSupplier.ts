import { ISupplier } from '@/lib/definitions';
import { clientApi } from '@/lib/clientApi';
import { useMutation } from 'react-query';

const deleteSupplier = async (id: string): Promise<ISupplier> => {
  const supplier = await clientApi.delete(`/supplier/${id}`);
  return supplier.data;
};

export const useDeleteSupplierMutation = () => {
  return useMutation({
    mutationFn: (id: string) => {
      return deleteSupplier(id);
    },
    mutationKey: ['supplier-complete'],
  });
};