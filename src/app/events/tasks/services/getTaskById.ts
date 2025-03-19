import { ITask } from '@/lib/definitions';
import { clientApi } from '@/lib/clientApi';
import { useQuery } from 'react-query';

const getTaskById = async (id: string): Promise<ITask> => {
  const task = await clientApi.get(`/task/${id}`);
  return task.data;
};

export const useGetTaskById = (id: string) => {
  return useQuery({
    enabled: !!id,
    refetchOnWindowFocus: false,
    queryKey: ['task-by-id', id],
    queryFn: () => getTaskById(id),
    retry: 2,
  });
};