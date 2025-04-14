'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Form } from 'react-final-form';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/Dialog';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { FormSavingLoader } from '@/components/FormLoader';
import { ISupplier, IUser } from '@/lib/definitions';
import { SupplierForm } from '@/app/suppliers/forms/SupplierForm';
import { useGetSupplierById } from '@/app/suppliers/services/getSupplierById';
import { useUpdateSupplierMutation } from '@/app/suppliers/services/updateSupplier';

interface EditSupplierProps {
  id: string;
  user: IUser;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const EditSupplier = (props: EditSupplierProps) => {
  const { id, user, open, setOpen } = props;
  const [isLoading, setIsLoading] = useState(true);
  const [loadingContent, setLoadingContent] = useState<React.ReactNode>(
    <FormSavingLoader message="Cargando información del proovedor" />,
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
      title="Actualizando Proovedor"
      isLoading={isLoading}
      loadingContent={loadingContent}
      footer={
        <Button
          type="submit"
          form="supplier-form"
          className="bg-secondary text-white rounded-3xl animate-fade-right animate-once animate-duration-500 animate-delay-100 animate-ease-in"
        >
          Guardar
        </Button>
      }
      trigger={null}
    >
      <SupplierWrapper
        id={id}
        setOpen={setOpen}
        setIsLoading={setIsLoading}
        setLoadingContent={setLoadingContent}
        user={user}
      />
    </Dialog>
  );
};

interface SupplierWrapperProps {
  id: string;
  setOpen: (open: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  setLoadingContent: (content: React.ReactNode) => void;
  user: IUser;
}

const SupplierWrapper = (props: SupplierWrapperProps) => {
  const { id, setOpen, setLoadingContent, setIsLoading } = props;
  const { data, isLoading } = useGetSupplierById(id);
  const { mutateAsync, isLoading: isUpdateLoading } = useUpdateSupplierMutation();
  const router = useRouter();

  const onSubmit = useCallback(
    (data: ISupplier) => {
      setLoadingContent(
        <FormSavingLoader message="Guardando información del proovedor" />,
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
      return data;
    }
    return {};
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
      {(formProps) => <SupplierForm {...formProps} />}
    </Form>
  );
};
