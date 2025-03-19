'use client';

import { useCallback } from 'react';
import { Dialog } from '@/components/Dialog';
import * as React from 'react';
import { FormSavingLoader } from '@/components/FormLoader';
import { Button } from '@/components/ui/button';
import { useCompleteTaskMutation } from '@/app/events/tasks/services/completeTask';

interface CompleteEventProps {
  id: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const TaskComplete = (props: CompleteEventProps) => {
  const { id, open, setOpen } = props;
  const { mutateAsync, isLoading } = useCompleteTaskMutation();

  const handleComplete = useCallback(() => {
    mutateAsync(id).then(() => {
      setOpen(false);
    });
  }, [id, mutateAsync, setOpen]);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      title="Completar la tarea"
      isLoading={isLoading}
      loadingContent={<FormSavingLoader message="Completando la tarea" />}
      footer={
        <Button
          type="button"
          onClick={handleComplete}
          className="bg-secondary text-white rounded-3xl animate-fade-right animate-once animate-duration-500 animate-delay-100 animate-ease-in"
        >
          Completar
        </Button>
      }
      trigger={null}
    >
      Seguro que desea completar la tarea.
    </Dialog>
  );
};
