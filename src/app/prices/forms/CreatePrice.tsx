'use client';

import { useCallback, useEffect, useState } from 'react';
import { Form } from 'react-final-form';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/Dialog';
import * as React from 'react';
import { useCreateMutation } from '@/app/prices/services/client';
import { useRouter } from 'next/navigation';
import { FormSavingLoader } from '@/components/FormLoader';
import { PriceForm, PriceFormProps } from '@/app/prices/forms/PriceForm';

export const CreatePrice = () => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingContent, setLoadingContent] = useState<React.ReactNode>(null);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      title="Creación de precio"
      isLoading={isLoading}
      loadingContent={loadingContent}
      footer={
        <Button
          type="submit"
          form="price-form"
          className="bg-secondary text-white rounded-3xl animate-fade-right animate-once animate-duration-500 animate-delay-100 animate-ease-in"
        >
          Crear
        </Button>
      }
      trigger={
        <Button className="bg-secondary text-white rounded-3xl animate-fade-left animate-once animate-duration-500 animate-delay-100 animate-ease-in">
          Crear
        </Button>
      }
    >
      <PriceFormWrapper
        setOpen={setOpen}
        setIsLoading={setIsLoading}
        setLoadingContent={setLoadingContent}
      />
    </Dialog>
  );
};

interface PriceFormWrapperProps {
  setOpen: (open: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  setLoadingContent: (content: React.ReactNode) => void;
}

const PriceFormWrapper = (props: PriceFormWrapperProps) => {
  const { setOpen, setLoadingContent, setIsLoading } = props;
  const { mutateAsync, isLoading } = useCreateMutation();
  const router = useRouter();

  const onSubmit = useCallback(
    (data: PriceFormProps) => {
      setLoadingContent(
        <FormSavingLoader message="Creando un nuevo Vehículo" />,
      );
      setIsLoading(true);
      mutateAsync({
        ...data,
        priceClient: +data.priceClient,
        priceSchool: +data.priceSchool,
      }).then(() => {
        router.refresh();
        setOpen(false);
      });
    },
    [mutateAsync, router, setIsLoading, setLoadingContent, setOpen],
  );

  useEffect(() => {
    if (!isLoading) {
      setIsLoading(false);
    }
  }, [isLoading, setIsLoading]);

  if (isLoading) {
    return null;
  }

  const initialValues = {
    description: undefined,
    note: undefined,
    priceClient: undefined,
    priceSchool: undefined,
    locationId: undefined,
  };

  return (
    <Form initialValues={initialValues} onSubmit={onSubmit}>
      {(formProps) => <PriceForm {...formProps} />}
    </Form>
  );
};
