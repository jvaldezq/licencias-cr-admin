import { useQuery } from 'react-query';
import { clientApi } from '@/lib/clientApi';

interface PromoParticipant {
  id: string;
  customerName: string;
  customerPhone: string;
  assetName: string;
  eventDate: Date | null;
}

const getPromoParticipants = async (): Promise<PromoParticipant[]> => {
  const response = await clientApi.get('/promo-participants');
  return response.data;
};

export const useGetPromoParticipants = () => {
  return useQuery({
    queryKey: ['promo-participants'],
    queryFn: getPromoParticipants,
  });
};
