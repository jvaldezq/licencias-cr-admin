'use client';

import { useCallback, useEffect, useState } from 'react';
import { Form } from 'react-final-form';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/Dialog';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { FormSavingLoader } from '@/components/FormLoader';
import { SupplierForm } from '@/app/suppliers/forms/SupplierForm';
import { ISupplier } from '@/lib/definitions';
import { useCreateSupplierMutation } from '@/app/suppliers/services/createSupplier';

export const CreateSupplier = () => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingContent, setLoadingContent] = useState<React.ReactNode>(null);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      title="Creación de Proveedor"
      isLoading={isLoading}
      loadingContent={loadingContent}
      footer={
        <Button
          type="submit"
          form="supplier-form"
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
      <SupplierFormWrapper
        setOpen={setOpen}
        setIsLoading={setIsLoading}
        setLoadingContent={setLoadingContent}
      />
    </Dialog>
  );
};

interface SupplierFormWrapperProps {
  setOpen: (open: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  setLoadingContent: (content: React.ReactNode) => void;
}

const SupplierFormWrapper = (props: SupplierFormWrapperProps) => {
  const { setOpen, setLoadingContent, setIsLoading } = props;
  const { mutateAsync, isLoading } = useCreateSupplierMutation();
  const router = useRouter();

  const onSubmit = useCallback(
    (data: ISupplier) => {
      setLoadingContent(
        <FormSavingLoader message="Creando un nuevo Proveedor" />,
      );
      setIsLoading(true);
      mutateAsync(data).then(() => {
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

  return (
    <Form initialValues={{}} onSubmit={onSubmit}>
      {(formProps) => <SupplierForm {...formProps} />}
    </Form>
  );
};
