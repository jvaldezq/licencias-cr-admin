'use client';

import { useCallback } from 'react';
import { Dialog } from '@/components/Dialog';
import * as React from 'react';
import { FormSavingLoader } from '@/components/FormLoader';
import { Button } from '@/components/ui/button';
import { useDeleteSupplierMutation } from '@/app/suppliers/services/deleteSupplier';
import { useRouter } from 'next/navigation';

interface CompleteEventProps {
  id: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const DeleteSupplier = (props: CompleteEventProps) => {
  const { id, open, setOpen } = props;
  const { mutateAsync, isLoading } = useDeleteSupplierMutation();
  const router = useRouter();

  const handleDelete = useCallback(() => {
    mutateAsync(id).then(() => {
      setOpen(false);
      router.refresh();

    });
  }, [id, mutateAsync, router, setOpen]);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      title="Eliminar Proovedor"
      isLoading={isLoading}
      loadingContent={<FormSavingLoader message="Eliminando Proovedor" />}
      footer={
        <Button
          type="button"
          onClick={handleDelete}
          className="bg-secondary text-white rounded-3xl animate-fade-right animate-once animate-duration-500 animate-delay-100 animate-ease-in"
        >
          Eliminar
        </Button>
      }
      trigger={null}
    >
      Seguro que desea eliminar este proovedor
    </Dialog>
  );
};
