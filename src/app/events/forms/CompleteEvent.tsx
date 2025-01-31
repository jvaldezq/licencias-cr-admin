'use client';

import { useCallback } from 'react';
import { Dialog } from '@/components/Dialog';
import * as React from 'react';
import { FormSavingLoader } from '@/components/FormLoader';
import {
  useCompleteMutation,
  useGetEventById,
} from '@/app/events/services/client';
import { Button } from '@/components/ui/button';
import {
  Field,
  Form,
  FormRenderProps,
  SupportedInputs,
} from 'react-final-form';
import { FormSwitch } from '@/components/Forms/Switch/FormSwitch';
import { CLASS_TYPE } from '@/lib/definitions';
import { useRouter } from 'next/navigation';

interface CompleteEventProps {
  id: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}

interface IEventCompleteForm {
  testPassed: boolean;
}

export const CompleteEvent = (props: CompleteEventProps) => {
  const { id, open, setOpen } = props;
  const { data: event, isLoading } = useGetEventById(id);
  const router = useRouter();
  const { mutateAsync } = useCompleteMutation();
  const isClassType = event?.typeId === CLASS_TYPE.CLASS;

  const onSubmit = useCallback(
    (data: IEventCompleteForm) => {
      mutateAsync({
        testPassed: data?.testPassed,
        id,
      }).then(() => {
        router.refresh();
        setOpen(false);
      });
    },
    [id, mutateAsync, router, setOpen],
  );

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      title={isClassType ? 'Completar la clase' : 'Completar de Cita'}
      isLoading={isLoading}
      loadingContent={
        <FormSavingLoader
          message={
            isClassType ? 'Completando la clase' : ' Completando la cita'
          }
        />
      }
      footer={
        <Button
          type="submit"
          form="event-complete-form"
          className="bg-secondary text-white rounded-3xl animate-fade-right animate-once animate-duration-500 animate-delay-100 animate-ease-in"
        >
          Completar
        </Button>
      }
      trigger={null}
    >
      {!isLoading && (
        <Form
          initialValues={{
            testPassed: false,
          }}
          onSubmit={onSubmit}
          mutators={{
            clearFieldValue: ([fieldName], state, { changeValue }) => {
              changeValue(state, fieldName, () => undefined);
            },
          }}
        >
          {(formProps) => (
            <CompleteForm {...formProps} isClassType={isClassType} />
          )}
        </Form>
      )}
    </Dialog>
  );
};

export type CompleteFormProps = FormRenderProps<IEventCompleteForm> & {
  isClassType?: boolean;
};

const CompleteForm = (props: CompleteFormProps) => {
  const { handleSubmit, isClassType } = props;

  return (
    <form id="event-complete-form" onSubmit={handleSubmit} className="py-4">
      {isClassType ? (
        <p>Está seguro que desea completar la clase?</p>
      ) : (
        <Field
          name="testPassed"
          component={FormSwitch as unknown as SupportedInputs}
          placeholder="Prueba aprobada"
          label="Prueba aprobada"
        />
      )}
    </form>
  );
};
