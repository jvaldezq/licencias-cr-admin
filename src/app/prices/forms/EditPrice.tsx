'use client';

import { useCallback, useEffect, useState } from 'react';
import { Form } from 'react-final-form';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/Dialog';
import * as React from 'react';
import {
  useGetPriceById,
  useUpdateMutation,
} from '@/app/prices/services/client';
import { useRouter } from 'next/navigation';
import { PriceForm, PriceFormProps } from '@/app/prices/forms/PriceForm';
import { FormSavingLoader } from '@/components/FormLoader';

interface Props {
  id: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const EditPrice = (props: Props) => {
  const { id, open, setOpen } = props;
  const [isLoading, setIsLoading] = useState(true);
  const [loadingContent, setLoadingContent] = useState<React.ReactNode>(
    <FormSavingLoader message="Cargando información de la Sede" />,
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
      title="Actualizando Registro"
      isLoading={isLoading}
      loadingContent={loadingContent}
      footer={
        <Button
          type="submit"
          form="price-form"
          className="bg-secondary text-white rounded-3xl animate-fade-right animate-once animate-duration-500 animate-delay-100 animate-ease-in"
        >
          Guardar
        </Button>
      }
      trigger={null}
    >
      <PriceWrapper
        id={id}
        setOpen={setOpen}
        setIsLoading={setIsLoading}
        setLoadingContent={setLoadingContent}
      />
    </Dialog>
  );
};

interface PriceWrapperProps {
  id: string;
  setOpen: (open: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  setLoadingContent: (content: React.ReactNode) => void;
}

const PriceWrapper = (props: PriceWrapperProps) => {
  const { id, setOpen, setLoadingContent, setIsLoading } = props;
  const { data, isLoading } = useGetPriceById(id);
  const { mutateAsync, isLoading: isUpdateLoading } = useUpdateMutation();
  const router = useRouter();

  const onSubmit = useCallback(
    (data: PriceFormProps) => {
      setLoadingContent(
        <FormSavingLoader message="Guardando información del Precio" />,
      );
      setIsLoading(true);
      mutateAsync({
        ...data,
        priceClient: +data.priceClient,
        priceSchool: +data.priceSchool,
      }).then(() => {
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

  if (isLoading || isUpdateLoading) {
    return null;
  }

  return (
    <Form initialValues={data} onSubmit={onSubmit}>
      {(formProps) => <PriceForm {...formProps} />}
    </Form>
  );
};
