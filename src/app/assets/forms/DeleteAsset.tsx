'use client';

import { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/Dialog';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { FormSavingLoader } from '@/components/FormLoader';
import { useDeleteMutation } from '@/app/assets/services/client';

interface Props {
  id: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const DeleteAsset = (props: Props) => {
  const { id, open, setOpen } = props;
  const { mutateAsync, isLoading } = useDeleteMutation();
  const router = useRouter();

  const onDelete = useCallback(() => {
    mutateAsync(id).then(() => {
      setOpen(false);
      router.refresh();
    });
  }, [id, mutateAsync, router, setOpen]);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      title="Eliminar Vehículo"
      isLoading={isLoading}
      loadingContent={<FormSavingLoader message="Eliminando Vehículo" />}
      footer={
        <Button
          onClick={onDelete}
          className="bg-secondary text-white rounded-3xl animate-fade-right animate-once animate-duration-500 animate-delay-100 animate-ease-in"
        >
          Eliminar
        </Button>
      }
      trigger={null}
    >
      {isLoading ? null : (
        <p className="text-primary text-base font-medium">
          Está seguro que desea eliminar la Vehículo
        </p>
      )}
    </Dialog>
  );
};
