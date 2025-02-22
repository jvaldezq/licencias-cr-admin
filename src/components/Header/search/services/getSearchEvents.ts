import { clientApi } from '@/lib/clientApi';
import { useQuery } from 'react-query';
import { IEvent } from '@/lib/definitions';

const getSearchEvents = async (search: string): Promise<IEvent[]> => {
  const response = await clientApi.get('/search/event', {
    params: { search },
  });
  return response.data;
};

export const useGetSearchEvents = (search: string) => {
  return useQuery({
    enabled: !!search,
    staleTime: 1,
    refetchOnWindowFocus: false,
    queryKey: ['search-events', search],
    queryFn: () => getSearchEvents(search),
    retry: 2,
  });
};
