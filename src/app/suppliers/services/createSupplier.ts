import { useMutation } from 'react-query';
import { ISupplier } from '@/lib/definitions';
import { clientApi } from '@/lib/clientApi';

const createSupplier = async (data: ISupplier): Promise<ISupplier> => {
  const supplier = await clientApi.post('/supplier', data);
  return supplier.data;
};

export const useCreateSupplierMutation = () => {
  return useMutation({
    mutationFn: (data: ISupplier) => {
      return createSupplier(data);
    },
    mutationKey: ['supplier-create'],
  });
};
