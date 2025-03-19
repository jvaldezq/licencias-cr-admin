import { ITask } from '@/lib/definitions';
import { clientApi } from '@/lib/clientApi';
import { useMutation } from 'react-query';

const completeTask = async (id: string): Promise<ITask> => {
  const task = await clientApi.patch(`/task/${id}/complete`);
  return task.data;
};

export const useCompleteTaskMutation = () => {
  return useMutation({
    mutationFn: (id: string) => {
      return completeTask(id);
    },
    mutationKey: ['task-complete'],
  });
};