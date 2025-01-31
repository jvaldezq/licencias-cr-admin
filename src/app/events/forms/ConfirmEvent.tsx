'use client';

import { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/Dialog';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { FormSavingLoader } from '@/components/FormLoader';
import { useConfirmationMutation } from '@/app/events/services/client';

interface ConfirmEventProps {
  id: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const ConfirmEvent = (props: ConfirmEventProps) => {
  const { id, setOpen, open } = props;
  const { mutateAsync, isLoading } = useConfirmationMutation();
  const router = useRouter();

  const handleConfirm = useCallback(() => {
    mutateAsync(id).then(() => {
      setOpen(false);
      router.refresh();
    });
  }, [id, mutateAsync, router, setOpen]);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      title="Confirmar cliente"
      isLoading={isLoading}
      loadingContent={<FormSavingLoader message="Confirmando cliente" />}
      footer={
        <Button
          onClick={handleConfirm}
          className="bg-secondary text-white rounded-3xl animate-fade-right animate-once animate-duration-500 animate-delay-100 animate-ease-in"
        >
          Confirmar
        </Button>
      }
      trigger={null}
    >
      {isLoading ? null : (
        <p className="text-primary text-base font-medium">
          Está seguro que desea confirmar a este cliente?
        </p>
      )}
    </Dialog>
  );
};
