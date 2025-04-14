'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  Field,
  Form,
  FormRenderProps,
  SupportedInputs,
} from 'react-final-form';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/Dialog';
import * as React from 'react';
import {
  useCompleteChecksMutation,
  useGetAssetById,
} from '@/app/assets/services/client';
import { useRouter } from 'next/navigation';
import { FormSavingLoader } from '@/components/FormLoader';
import { FormSwitch } from '@/components/Forms/Switch/FormSwitch';
import { FormTextarea } from '@/components/Forms/Textarea/FormTextarea';

export interface CarChecksFormProps {
  coolantDate: boolean;
  oilDate: boolean;
  note?: string;
  id?: string;
}

interface Props {
  id: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const CarChecks = (props: Props) => {
  const { id, open, setOpen } = props;
  const [isLoading, setIsLoading] = useState(true);
  const [loadingContent, setLoadingContent] = useState<React.ReactNode>(
    <FormSavingLoader message="Cargando información del Vehículo" />,
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
      title="Actualizando Revisión de Vehículo"
      isLoading={isLoading}
      loadingContent={loadingContent}
      footer={
        <Button
          type="submit"
          form="car-checks-form"
          className="bg-secondary text-white rounded-3xl animate-fade-right animate-once animate-duration-500 animate-delay-100 animate-ease-in"
        >
          Guardar revisión
        </Button>
      }
      trigger={null}
    >
      <CarChecksWrapper
        id={id}
        setOpen={setOpen}
        setIsLoading={setIsLoading}
        setLoadingContent={setLoadingContent}
      />
    </Dialog>
  );
};

interface CarChecksWrapperProps {
  id: string;
  setOpen: (open: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  setLoadingContent: (content: React.ReactNode) => void;
}

const CarChecksWrapper = (props: CarChecksWrapperProps) => {
  const { id, setOpen, setLoadingContent, setIsLoading } = props;
  const { data, isLoading } = useGetAssetById(id);
  const { mutateAsync, isLoading: isCompleteChecksLoading } = useCompleteChecksMutation();
  const router = useRouter();

  const onSubmit = useCallback(
    (data: CarChecksFormProps) => {
      setLoadingContent(
        <FormSavingLoader message="Guardando información del Vehículo" />,
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

  if (isLoading || isCompleteChecksLoading) {
    return null;
  }

  return (
    <Form
      initialValues={{
        coolantDate: true,
        oilDate: true,
        note: data?.note,
        id: data?.id
      }}
      onSubmit={onSubmit}
    >
      {(formProps) => <CarChecksForm {...formProps} />}
    </Form>
  );
};

export type FormProps = FormRenderProps<CarChecksFormProps>;

export const CarChecksForm = (props: FormProps) => {
  const { handleSubmit } = props;

  return (
    <form
      id="car-checks-form"
      onSubmit={handleSubmit}
      className="grid md:grid-cols-2 gap-6 py-4"
    >
      <Field
        name="coolantDate"
        component={FormSwitch as unknown as SupportedInputs}
        placeholder="Revisión de Coolant"
        label="Revisión de Coolant"
      />
      <Field
        name="oilDate"
        component={FormSwitch as unknown as SupportedInputs}
        placeholder="Revisión de Aceite"
        label="Revisión de Aceite"
      />
      <Field
        name="note"
        component={FormTextarea as unknown as SupportedInputs}
        type=""
        placeholder="Comentarios/Notas"
        label="Comentarios/Notas"
        wrapperClassName="md:col-span-2"
      />
    </form>
  );
};
