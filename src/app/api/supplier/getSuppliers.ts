import prisma from '@/lib/prisma';
import { ISupplier} from '@/lib/definitions';

export const getSuppliers = async () => {
  return (await prisma.supplier.findMany()) as unknown as ISupplier[];
};
