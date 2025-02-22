'use client';

import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/Dialog';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { FormSavingLoader } from '@/components/FormLoader';
import {
  usePaymentMutation,
  useGetEventById,
} from '@/app/events/services/client';
import { CRCFormatter } from '@/lib/NumberFormats';
import { Field, Form, SupportedInputs } from 'react-final-form';
import { IUser, PAYMENT_TYPE } from '@/lib/definitions';
import { FormRadioBox } from '@/components/Forms/RadioBox.tsx/RadioBox';
import { FormInput } from '@/components/Forms/Input/FormInput';
import dayjs from 'dayjs';

interface CompleteEventProps {
  id: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  user: IUser;
}

export const PaymentEvent = (props: CompleteEventProps) => {
  const { id, setOpen, open, user } = props;
  const [isLoading, setIsLoading] = useState(true);
  const [loadingContent, setLoadingContent] = useState<React.ReactNode>(
    <FormSavingLoader message="Cargando..." />,
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
      title="Abono/Pago"
      isLoading={isLoading}
      loadingContent={loadingContent}
      footer={
        <Button
          type="submit"
          form="event-complete-form"
          className="bg-secondary text-white rounded-3xl animate-fade-right animate-once animate-duration-500 animate-delay-100 animate-ease-in"
        >
          Pagar
        </Button>
      }
      trigger={null}
    >
      <EventWrapper
        id={id}
        user={user}
        setOpen={setOpen}
        setIsLoading={setIsLoading}
        setLoadingContent={setLoadingContent}
      />
    </Dialog>
  );
};

interface EventWrapperProps {
  id: string;
  setOpen: (open: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  setLoadingContent: (content: React.ReactNode) => void;
  user: IUser;
}

interface IFormProps {
  type: PAYMENT_TYPE;
  amount: number;
}

export const PAYMENT_OPTIONS = [
  { name: 'Efectivo', id: PAYMENT_TYPE.CASH },
  {
    name: 'Tarjeta',
    id: PAYMENT_TYPE.CARD,
  },
  { name: 'Sinpe', id: PAYMENT_TYPE.SINPE },
];

const EventWrapper = (props: EventWrapperProps) => {
  const { id, setOpen, setLoadingContent, setIsLoading, user } = props;
  const { data, isLoading } = useGetEventById(id);
  const { mutateAsync, isLoading: isPaymentLoading } = usePaymentMutation();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      setIsLoading(false);
    }
  }, [isLoading, setIsLoading]);

  const onSubmit = useCallback(
    (data: IFormProps) => {
      setIsLoading(true);
      setLoadingContent(<FormSavingLoader message="Completando pago" />);
      mutateAsync({ id, type: data.type, amount: +data.amount, user }).then(
        () => {
          setOpen(false);
          router.refresh();
        },
      );
    },
    [id, mutateAsync, router, setIsLoading, setLoadingContent, setOpen, user],
  );

  if (isLoading || isPaymentLoading) {
    return null;
  }

  const price = data?.payment?.price || 0;
  const cashAdvance = data?.payment?.cashAdvance || 0;
  const amountToPay = price - cashAdvance;

  const initialValues = {
    type: PAYMENT_TYPE.CASH,
    amount: amountToPay,
  };

  return (
    <Form initialValues={initialValues} onSubmit={onSubmit}>
      {(formProps) => (
        <form
          id="event-complete-form"
          onSubmit={formProps.handleSubmit}
          className="flex flex-col gap-4 items-center w-full"
        >
          <div className="w-full">
            <p className="text-primary/[0.7] text-sm">Cliente</p>
            <p className="font-semibold text-primary">{data?.customer?.name}</p>
          </div>

          <div className="w-full">
            <p className="text-primary/[0.7] text-sm">Dictamen Médico</p>
            <p className="font-semibold text-primary">
              {data?.hasMedical ? 'Si' : 'No'}
            </p>
          </div>

          <div className="w-full">
            <p className="text-primary/[0.7] text-sm">Comentarios</p>
            <p className="font-semibold text-primary">{data?.notes ?? '-'}</p>
          </div>

          <div className="flex  border-t border-solid border-primary py-4 justify-between items-center gap-2 w-full">
            <p className="font-semibold text-primary/[0.9]">Monto Total</p>
            <p className="font-semibold text-primary">{CRCFormatter(price)}</p>
          </div>

          {data?.payment?.cashPaymentsAdvance?.map((payment, index) => (
            <div
              key={`payment-${index}`}
              className="flex justify-between items-center gap-2 w-full border-dashed border-b border-primary/[0.2]"
            >
              <p className="text-sm font-semibold text-primary/[0.9] flex gap-2">
                <span>
                  {
                    PAYMENT_OPTIONS.find(
                      (option) => option?.id === (payment.type as unknown),
                    )?.name
                  }
                </span>
                <span>
                  {' '}
                  ({dayjs(payment?.createdAt).format('YYYY MMM DD')})
                </span>
              </p>
              <p className="text-sm font-semibold text-success">
                {CRCFormatter(payment?.amount || 0)}
              </p>
            </div>
          ))}

          <div className="flex justify-between items-center gap-2 w-full bg-error/[0.2] p-4 rounded-2xl">
            <p className="font-semibold text-primary/[0.9]">Pendiente</p>
            <p className="font-bold text-error">{CRCFormatter(amountToPay)}</p>
          </div>

          <div className="w-full flex flex-col gap-4 py-4 border-t border-solid border-primary">
            <Field
              name="amount"
              component={FormInput as unknown as SupportedInputs}
              label="Monto a Pagar"
              placeholder="Monto a Pagar"
              validate={(value) =>
                value !== undefined ? undefined : 'El monto es requerido'
              }
            />
            <Field
              name="type"
              component={FormRadioBox as unknown as SupportedInputs}
              options={PAYMENT_OPTIONS}
              wrapperClassName="w-full"
            />
          </div>
        </form>
      )}
    </Form>
  );
};
