import { ITask } from '@/lib/definitions';
import { clientApi } from '@/lib/clientApi';
import { useMutation } from 'react-query';
import { ITaskForm } from '@/app/events/tasks/CreateTask';

const updateTask = async (body: ITaskForm): Promise<ITask> => {
  const task = await clientApi.patch(`/task/${body?.id}`, body);
  return task.data;
};

export const useUpdateTaskMutation = () => {
  return useMutation({
    mutationFn: (data: ITaskForm) => {
      return updateTask(data);
    },
    mutationKey: ['task-update'],
  });
};