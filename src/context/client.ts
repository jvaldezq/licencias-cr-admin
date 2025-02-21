import { useQuery } from 'react-query';
import { ILog, IUser } from '@/lib/definitions';
import { clientApi } from '@/lib/clientApi';

interface getLogsProps {
  eventId?: string;
  assetId?: string;
}

interface Response {
  created: { createdAt: string; createdBy: IUser };
  logs: ILog[];
}

const getLogs = async (data: getLogsProps): Promise<Response> => {
  const logs = await clientApi.get('/log', {
    params: {
      ...data,
    },
  });
  return logs.data;
};

export const useGetLogs = (data: getLogsProps) => {
  return useQuery({
    enabled: !!data?.eventId || !!data?.assetId,
    staleTime: 1,
    refetchOnWindowFocus: false,
    queryKey: ['get-logs', data?.eventId, data?.assetId],
    queryFn: () => getLogs(data),
    retry: 2,
  });
};
