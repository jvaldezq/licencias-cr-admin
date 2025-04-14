import { ISupplier } from '@/lib/definitions';
import { clientApi } from '@/lib/clientApi';
import { useMutation } from 'react-query';

const updateSupplier = async (body: ISupplier): Promise<ISupplier> => {
  const supplier = await clientApi.patch(`/supplier/${body?.id}`, body);
  return supplier.data;
};

export const useUpdateSupplierMutation = () => {
  return useMutation({
    mutationFn: (data: ISupplier) => {
      return updateSupplier(data);
    },
    mutationKey: ['supplier-update'],
  });
};