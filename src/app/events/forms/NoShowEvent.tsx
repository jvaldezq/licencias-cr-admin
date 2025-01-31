'use client';

import { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/Dialog';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { FormSavingLoader } from '@/components/FormLoader';
import { useNoShowMutation } from '@/app/events/services/client';

interface NoShowEventProps {
  id: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const NoShowEvent = (props: NoShowEventProps) => {
  const { id, setOpen, open } = props;
  const { mutateAsync, isLoading } = useNoShowMutation();
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
      title="Cliente no se presentó"
      isLoading={isLoading}
      loadingContent={<FormSavingLoader message="Cerrando cita" />}
      footer={
        <Button
          onClick={handleConfirm}
          className="bg-secondary text-white rounded-3xl animate-fade-right animate-once animate-duration-500 animate-delay-100 animate-ease-in"
        >
          Cerrar
        </Button>
      }
      trigger={null}
    >
      {isLoading ? null : (
        <p className="text-primary text-base font-medium">
          ¿Está seguro que desea cerrar esta cita?
        </p>
      )}
    </Dialog>
  );
};
