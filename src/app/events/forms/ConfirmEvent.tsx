'use client';

import { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/Dialog';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { FormSavingLoader } from '@/components/FormLoader';
import { useConfirmationMutation } from '@/app/events/services/client';
import { Copy } from 'lucide-react';
import { WhatsappIcon } from '@/assets/icons/WhatsappIcon';

interface ConfirmEventProps {
  id: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  handleCopyConfirmation?: () => void;
  handleCopyWhatsApp?: () => void;
}

export const ConfirmEvent = (props: ConfirmEventProps) => {
  const { id, setOpen, open, handleCopyConfirmation, handleCopyWhatsApp } =
    props;
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
      {isLoading ? null : (
        <div className="flex gap-5 items-center">
          {handleCopyConfirmation && (
            <Button
              className="border-secondary border border-solid bg-white text-secondary hover:bg-secondary/[0.7] hover:text-white transition-all rounded-3xl animate-fade-right animate-once animate-duration-500 animate-delay-100 animate-ease-in flex gap-2 items-center"
              onClick={handleCopyConfirmation}
            >
              Copiar confirmación
              <Copy className="w-4" />
            </Button>
          )}

          {handleCopyWhatsApp && (
            <Button
              className="border-secondary border border-solid bg-white text-secondary hover:bg-secondary/[0.7] hover:text-white transition-all rounded-3xl animate-fade-right animate-once animate-duration-500 animate-delay-100 animate-ease-in flex gap-2 items-center"
              onClick={handleCopyWhatsApp}
            >
              Enviar por WhatsApp
              <WhatsappIcon className="h-4" />
            </Button>
          )}
        </div>
      )}
    </Dialog>
  );
};
