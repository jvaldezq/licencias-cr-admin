'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Form } from 'react-final-form';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/Dialog';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { FormSavingLoader } from '@/components/FormLoader';
import { EventForm } from '@/app/events/forms/EventsForm';
import { CLASS_TYPE, IEventForm, IUser } from '@/lib/definitions';
import {
  useGetEventById,
  useUpdateMutation,
} from '@/app/events/services/client';
import dayjs from 'dayjs';

interface EditEventProps {
  id: string;
  user: IUser;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const EditEvent = (props: EditEventProps) => {
  const { id, user, open, setOpen } = props;
  const [isLoading, setIsLoading] = useState(true);
  const [loadingContent, setLoadingContent] = useState<React.ReactNode>(
    <FormSavingLoader message="Cargando información de la Cita" />,
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
      title="Actualizando Cita"
      isLoading={isLoading}
      loadingContent={loadingContent}
      footer={
        <Button
          type="submit"
          form="event-form"
          className="bg-secondary text-white rounded-3xl animate-fade-right animate-once animate-duration-500 animate-delay-100 animate-ease-in"
        >
          Guardar
        </Button>
      }
      trigger={null}
    >
      <EventWrapper
        id={id}
        setOpen={setOpen}
        setIsLoading={setIsLoading}
        setLoadingContent={setLoadingContent}
        user={user}
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

const EventWrapper = (props: EventWrapperProps) => {
  const { id, setOpen, setLoadingContent, setIsLoading, user } = props;
  const { data, isLoading } = useGetEventById(id);
  const { mutateAsync, isLoading: isUpdateLoading } = useUpdateMutation();
  const router = useRouter();

  const onSubmit = useCallback(
    (data: IEventForm) => {
      setLoadingContent(
        <FormSavingLoader message="Guardando información de la Cita" />,
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
      return {
        id: data?.id,
        typeId: data?.typeId,
        customer: {
          name: data?.customer?.name,
          identification: data?.customer?.identification,
          phone: data?.customer?.phone,
          schedule: {
            startTime: data?.customer?.schedule?.startTime,
          },
        },
        locationId: data?.locationId,
        licenseTypeId: data?.licenseTypeId,
        date: data?.date || dayjs(),
        startTime:
          data?.typeId === CLASS_TYPE.CLASS
            ? data?.customer?.schedule?.startTime
            : data?.time,
        endTime: data?.customer?.schedule?.endTime || '',
        instructorId: data?.instructorId,
        assetId: data?.assetId,
        createdById: user.id,
        payment: {
          price: data?.payment?.price,
          cashAdvance: data?.payment?.cashAdvance,
        },
        notes: data.notes,
        hasMedical: data.hasMedical,
        isInternalReferred: data.isInternalReferred,
        isExternalReferred: data.isExternalReferred,
      };
    }
    return {
      typeId: undefined,
      customer: {
        name: undefined,
        identification: undefined,
        phone: undefined,
        schedule: {
          startTime: undefined,
        },
      },
      locationId: undefined,
      licenseTypeId: undefined,
      date: dayjs(),
      startTime: undefined,
      endTime: undefined,
      instructorId: undefined,
      assetId: undefined,
      createdById: user.id,
      payment: {
        price: undefined,
        cashAdvance: undefined,
      },
      notes: undefined,
      hasMedical: false,
    };
  }, [data, user.id]);

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
      {(formProps) => <EventForm {...formProps} isEdit={true} />}
    </Form>
  );
};
