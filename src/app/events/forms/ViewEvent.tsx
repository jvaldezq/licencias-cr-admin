'use client';

import { useEffect, useMemo, useState } from 'react';
import { Dialog } from '@/components/Dialog';
import * as React from 'react';
import { FormSavingLoader } from '@/components/FormLoader';
import { useGetEventById } from '@/app/events/services/client';
import { CRCFormatter } from '@/lib/NumberFormats';
import dayjs from 'dayjs';
import { IUser, PAYMENT_TYPE } from '@/lib/definitions';
import { Button } from '@/components/ui/button';
import { useLogContext } from '@/context/LogsContext';
import { WhatsappIcon } from '@/assets/icons/WhatsappIcon';
import { Stethoscope } from 'lucide-react';

export const PAYMENT_OPTIONS = [
  { name: 'Efectivo', id: PAYMENT_TYPE.CASH },
  {
    name: 'Tarjeta',
    id: PAYMENT_TYPE.CARD,
  },
  { name: 'Sinpe', id: PAYMENT_TYPE.SINPE },
];

interface ViewEventProps {
  id: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  user: IUser;
}

export const ViewEvent = (props: ViewEventProps) => {
  const { id, open, setOpen, user } = props;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!open) {
      setIsLoading(true);
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      title="Información de Cita"
      isLoading={isLoading}
      loadingContent={
        <FormSavingLoader message="Cargando información de la Cita" />
      }
      trigger={null}
    >
      <ViewEventWrapper id={id} setIsLoading={setIsLoading} user={user} />
    </Dialog>
  );
};

interface ViewEventWrapperProps {
  id: string;
  setIsLoading: (loading: boolean) => void;
  user: IUser;
}

const ViewEventWrapper = (props: ViewEventWrapperProps) => {
  const { id, setIsLoading, user } = props;
  const { data, isLoading } = useGetEventById(id);
  const { showLogs } = useLogContext();

  const price = data?.payment?.price || 0;
  const cashAdvance = data?.payment?.cashAdvance || 0;
  const amountToPay = price - cashAdvance;

  useEffect(() => {
    if (!isLoading) {
      setIsLoading(false);
    }
  }, [isLoading, setIsLoading]);

  const endTime = useMemo(() => {
    if (data?.type?.name?.includes('Clase')) {
      const [startTime, endTime] =
        data?.customer?.schedule?.endTime?.split(':') || [];
      return (
        <p className="text-primary font-semibold">
          {dayjs()
            .set('hour', +startTime)
            .set('minute', +endTime)
            .format('hh:mm A')}
        </p>
      );
    }
    const [startTime, endTime] = data?.time?.split(':') || [];
    return (
      <p className="text-secondary capitalize font-bold">
        {dayjs()
          .set('hour', +startTime)
          .set('minute', +endTime)
          .format('hh:mm A')}
      </p>
    );
  }, [data?.customer?.schedule?.endTime, data?.time, data?.type?.name]);

  const startTime = useMemo(() => {
    const [startTime, endTime] =
      data?.customer?.schedule?.startTime?.split(':') || [];
    return dayjs()
      .set('hour', +startTime)
      .set('minute', +endTime)
      .format('hh:mm A');
  }, [data?.customer?.schedule?.startTime]);

  const handleLogsClick = () => {
    showLogs({ eventId: id });
  };

  if (isLoading) {
    return null;
  }

  return (
    <section className="grid md:grid-cols-2 gap-4">
      <div className="flex justify-between items-center border-b border-solid border-primary/[0.2] w-full pb-1 md:col-span-2">
        <p className="font-semibold capitalize">CLIENTE</p>
        {user?.access?.admin && (
          <Button variant="default" onClick={handleLogsClick}>
            Registros
          </Button>
        )}
      </div>
      <div className="w-full md:col-span-full">
        <p className="text-primary/[0.7] text-sm">Cliente</p>
        <p className="font-semibold text-primary">{data?.customer?.name}</p>
      </div>

      <div className="w-full">
        <p className="text-primary/[0.7] text-sm">Cédula</p>
        <p className="font-semibold text-primary">
          {data?.customer?.identification}
        </p>
      </div>

      <div className="w-full">
        <p className="text-primary/[0.7] text-sm">Teléfono</p>
        <a
          className="font-semibold text-primary flex gap-1 items-center"
          href={`https://wa.me/506${data?.customer?.phone.replace(/-/g, '')}?text=`}
          target="_blank"
        >
          <WhatsappIcon className="h-4.5" />
          {data?.customer?.phone}
        </a>
      </div>

      <p className="md:col-span-2 border-b border-solid border-primary/[0.2] font-semibold pb-1 capitalize">
        {data?.type?.name?.includes('Clase') ? 'CLASE' : 'PRUEBA'}
      </p>

      <div className="w-full">
        <p className="text-primary/[0.7] text-sm">Sede</p>
        <p className="font-semibold text-primary">{data?.location.name}</p>
      </div>

      <div className="w-full">
        <p className="text-primary/[0.7] text-sm">Tipo licencia</p>
        <p className="font-semibold text-primary">{data?.licenseType?.name}</p>
      </div>

      <div className="w-full md:col-span-2">
        <p className="text-primary/[0.7] text-sm">Fecha</p>
        <p className="font-semibold text-primary">
          {dayjs(data?.date).format('YYYY MMM DD')}
        </p>
      </div>

      <div className="w-full">
        <p className="text-primary/[0.7] text-sm">Hora cliente / Inicio</p>
        <p className="font-semibold text-primary">{startTime}</p>
      </div>

      <div className="w-full">
        <p className="text-primary/[0.7] text-sm">Hora prueba / Fin</p>
        {endTime}
      </div>

      <div className="w-full">
        <p className="text-primary/[0.7] text-sm">Instructor</p>
        <p className="font-semibold text-primary">{data?.instructor?.name}</p>
      </div>

      <div className="w-full">
        <p className="text-primary/[0.7] text-sm">Vehículo</p>
        <p className="font-semibold text-primary">{data?.asset?.name}</p>
      </div>

      <div className="w-full">
        <p className="text-primary/[0.7] text-sm">Dictamen Médico</p>
        <p className="font-semibold text-primary flex items-center gap-2">
          {data?.hasMedical && <Stethoscope className="h-4 w-4" />}
          {data?.hasMedical ? 'Si' : 'No'}
        </p>
      </div>

      <p className="md:col-span-2 border-b border-solid border-primary/[0.2] font-semibold pb-1 capitalize">
        PRECIOS
      </p>

      <div className="w-full col-span-full flex flex-col gap-2">
        <div className="flex justify-between items-center gap-2 w-full">
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
              <span> ({dayjs(payment?.createdAt).format('YYYY MMM DD')})</span>
            </p>
            <p className="text-sm font-semibold text-success">
              {CRCFormatter(payment?.amount || 0)}
            </p>
          </div>
        ))}

        <div className="flex py-4 justify-between items-center gap-2 w-full">
          <p className="font-semibold text-primary/[0.9]">Pendiente</p>
          <p className="font-semibold text-error">
            {amountToPay === 0 ? 'Pagado' : CRCFormatter(amountToPay)}
          </p>
        </div>
      </div>

      <p className="md:col-span-2 border-b border-solid border-primary/[0.2] font-semibold pb-1 capitalize">
        EXTRAS
      </p>
      <div className="w-full">
        <p className="text-primary/[0.7] text-sm">Notas</p>
        <p className="font-semibold text-primary">{data?.notes}</p>
      </div>
    </section>
  );
};
