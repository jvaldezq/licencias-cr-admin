'use client';

import { useEffect, useState } from 'react';
import { Dialog } from '@/components/Dialog';
import * as React from 'react';
import { FormSavingLoader } from '@/components/FormLoader';
import { useGetTaskById } from '@/app/events/tasks/services/getTaskById';
import dayjs from 'dayjs';

interface ViewTaskProps {
  id: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const ViewTask = (props: ViewTaskProps) => {
  const { id, open, setOpen } = props;
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
      title="Información de tarea"
      isLoading={isLoading}
      loadingContent={
        <FormSavingLoader message="Cargando información de la tarea" />
      }
      trigger={null}
    >
      <ViewTaskWrapper id={id} setIsLoading={setIsLoading} />
    </Dialog>
  );
};

interface ViewTaskWrapperProps {
  id: string;
  setIsLoading: (loading: boolean) => void;
}

const ViewTaskWrapper = (props: ViewTaskWrapperProps) => {
  const { id, setIsLoading } = props;
  const { data, isLoading } = useGetTaskById(id);

  useEffect(() => {
    if (!isLoading) {
      setIsLoading(false);
    }
  }, [isLoading, setIsLoading]);

  if (isLoading) {
    return null;
  }

  const isOlder = dayjs(data?.date)
    .startOf('day')
    .isBefore(dayjs().startOf('day'));

  return (
    <section className="grid md:grid-cols-2 gap-4">

      <div className="w-full">
        <p className="text-primary/[0.7] text-sm">Estado</p>
        <p className="font-semibold text-primary">{data?.status}</p>
      </div>

      <div className="w-full">
        <p className="text-primary/[0.7] text-sm">Fecha</p>
        <p className={`capitalize ${isOlder ? 'text-error font-semibold' : 'text-success'}`}>
          {dayjs(data?.date).format('YYYY-MM-DD')}
        </p>
      </div>

      <div className="w-full">
        <p className="text-primary/[0.7] text-sm">Título</p>
        <p className="font-semibold text-primary">{data?.title}</p>
      </div>

      <div className="w-full">
        <p className="text-primary/[0.7] text-sm">Nota</p>
        <p className="font-semibold text-primary">{data?.notes}</p>
      </div>

      <div className="w-full">
        <p className="text-primary/[0.7] text-sm">Sede</p>
        <p className="font-semibold text-primary">{data?.location?.name}</p>
      </div>

      <div className="w-full">
        <p className="text-primary/[0.7] text-sm">Vehículo</p>
        <p className="font-semibold text-primary">{data?.asset?.name}</p>
      </div>

    </section>
  );
};
