'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Form } from 'react-final-form';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/Dialog';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { FormSavingLoader } from '@/components/FormLoader';
import { IUser } from '@/lib/definitions';
import { useUpdateTaskMutation } from '@/app/events//tasks/services/updateTask';
import { ITaskForm } from '@/app/events/tasks/CreateTask';
import { TaskForm } from '@/app/events/tasks/TaskForm';
import { useGetTaskById } from '@/app/events/tasks/services/getTaskById';

interface EditTaskProps {
  id: string;
  user: IUser;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const EditTask = (props: EditTaskProps) => {
  const { id, user, open, setOpen } = props;
  const [isLoading, setIsLoading] = useState(true);
  const [loadingContent, setLoadingContent] = useState<React.ReactNode>(
    <FormSavingLoader message="Cargando información de la Tarea" />,
  );

  useEffect(() => {
    if (!open) {
      setIsLoading(true);
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      title="Actualizando Tarea"
      isLoading={isLoading}
      loadingContent={loadingContent}
      footer={
        <Button
          type="submit"
          form="task-form"
          className="bg-secondary text-white rounded-3xl animate-fade-right animate-once animate-duration-500 animate-delay-100 animate-ease-in"
        >
          Guardar
        </Button>
      }
      trigger={null}
    >
      <TaskWrapper
        id={id}
        setOpen={setOpen}
        setIsLoading={setIsLoading}
        setLoadingContent={setLoadingContent}
        user={user}
      />
    </Dialog>
  );
};

interface TaskWrapperProps {
  id: string;
  setOpen: (open: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  setLoadingContent: (content: React.ReactNode) => void;
  user: IUser;
}

const TaskWrapper = (props: TaskWrapperProps) => {
  const { id, setOpen, setLoadingContent, setIsLoading } = props;
  const { data, isLoading } = useGetTaskById(id);
  const { mutateAsync, isLoading: isUpdateLoading } = useUpdateTaskMutation();
  const router = useRouter();

  const onSubmit = useCallback(
    (data: ITaskForm) => {
      setLoadingContent(
        <FormSavingLoader message="Guardando información de la tarea" />,
      );
      setIsLoading(true);
      mutateAsync(data).then(() => {
        setOpen(false);
        router.refresh();
      });
    },
    [mutateAsync, router, setIsLoading, setLoadingContent, setOpen],
  );

  useEffect(() => {
    if (!isLoading) {
      setIsLoading(false);
    }
  }, [isLoading, setIsLoading]);

  const initialValues = useMemo(() => {
    if (data) {
      return {
        id: data?.id,
        title: data?.title,
        status: data?.status,
        assetId: data?.assetId,
        locationId: data?.locationId,
        assignedToId: data?.assignedTo,
        date: data?.date,
        notes: data?.notes,
      };
    }
    return {
      title: '',
      status: '',
      assetId: '',
      locationId: '',
      assignedToId: '',
      date: '',
      notes: '',
    };
  }, [data]);

  if (isLoading || isUpdateLoading) {
    return null;
  }

  return (
    <Form
      initialValues={initialValues}
      onSubmit={onSubmit}
      mutators={{
        clearFieldValue: ([fieldName], state, { changeValue }) => {
          changeValue(state, fieldName, () => undefined);
        },
      }}
    >
      {(formProps) => <TaskForm {...formProps} />}
    </Form>
  );
};
