import { ITask } from '@/lib/definitions';
import { clientApi } from '@/lib/clientApi';
import { useMutation } from 'react-query';
import { ITaskForm } from '@/app/events/tasks/CreateTask';

const createTask = async (body: ITaskForm): Promise<ITask> => {
  const event = await clientApi.post(`/task`, body);
  return event.data;
};

export const useCreateTaskMutation = () => {
  return useMutation({
    mutationFn: (body: ITaskForm) => {
      return createTask(body);
    },
    mutationKey: ['create-task'],
  });
};
