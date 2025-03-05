'use client';

import { useCallback, useState } from 'react';
import { Form } from 'react-final-form';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/Dialog';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { IUser } from '@/lib/definitions';
import { TaskForm } from '@/app/events/tasks/TaskForm';
import { FormSavingLoader } from '@/components/FormLoader';
import { useCreateTaskMutation } from '@/app/events/tasks/services/createTask';

interface CreateTaskProps {
  user: IUser;
  locationId?: string;
}

export const CreateTask = (props: CreateTaskProps) => {
  const { user, locationId } = props;
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingContent, setLoadingContent] = useState<React.ReactNode>(null);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      title="Creación de tarea"
      isLoading={isLoading}
      loadingContent={loadingContent}
      footer={
        <Button
          type="submit"
          form="task-form"
          className="bg-secondary text-white rounded-3xl animate-fade-right animate-once animate-duration-500 animate-delay-100 animate-ease-in"
        >
          Crear
        </Button>
      }
      trigger={
        <Button className="bg-secondary text-white rounded-3xl animate-fade-left animate-once animate-duration-500 animate-delay-100 animate-ease-in w-fit self-end">
          Crear tarea
        </Button>
      }
    >
      {!isLoading && (
        <TaskWrapper
          setOpen={setOpen}
          setIsLoading={setIsLoading}
          setLoadingContent={setLoadingContent}
          user={user}
          locationId={locationId}
        />
      )}
    </Dialog>
  );
};

interface TaskWrapperProps {
  setOpen: (open: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  setLoadingContent: (content: React.ReactNode) => void;
  user: IUser;
  locationId?: string;
}

export interface ITaskForm {
  title?: string;
  status?: string;
  assetId?: string;
  locationId?: string;
  date?: string;
  notes?: string;
}

const TaskWrapper = (props: TaskWrapperProps) => {
  const { setOpen, setLoadingContent, setIsLoading, locationId } = props;
  const { mutateAsync } = useCreateTaskMutation();
  const router = useRouter();
  const initialValues = {
    locationId,
  };

  const onSubmit = useCallback(
    (data: ITaskForm) => {
      console.log(data);
      setLoadingContent(<FormSavingLoader message="Creando nueva tarea" />);
      setIsLoading(true);
      mutateAsync(data).then(() => {
        router.refresh();
        setOpen(false);
        setIsLoading(false);
      });
    },
    [mutateAsync, router, setIsLoading, setLoadingContent, setOpen],
  );

  return (
    <Form initialValues={initialValues} onSubmit={onSubmit}>
      {(formProps) => <TaskForm {...formProps} />}
    </Form>
  );
};
