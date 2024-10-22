'use client';

import {useCallback, useEffect, useMemo, useState} from "react";
import {Form} from "react-final-form";
import {Button} from "@/components/ui/button";
import {Dialog} from "@/components/Dialog";
import * as React from "react";
import {useRouter} from "next/navigation";
import {EditIcon} from "@/assets/icons/EditIcon";
import {FormSavingLoader} from "@/components/FormLoader";
import * as yup from "yup";
import {formValidator} from "@/lib/formValidator";
import {EventForm} from "@/app/events/forms/EventsForm";
import {IEventForm, IUser} from "@/lib/definitions";
import {
    useGetEventById, useUpdateMutation,
} from "@/app/events/services/client";
import dayjs from "dayjs";

interface EditEventProps {
    id: number;
    user: IUser;
}

export const EditEvent = (props: EditEventProps) => {
    const {id, user} = props;
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [loadingContent, setLoadingContent] = useState<React.ReactNode>(<FormSavingLoader
        message="Cargando información de la Cita"/>);

    useEffect(() => {
        if (!open) {
            setIsLoading(true);
        }
    }, [open]);

    return (<Dialog
        open={open}
        onOpenChange={setOpen}
        title="Actualizando Cita"
        isLoading={isLoading}
        loadingContent={loadingContent}
        footer={<Button
            type="submit" form="event-form"
            className="bg-secondary text-white rounded-3xl animate-fade-right animate-once animate-duration-500 animate-delay-100 animate-ease-in">Guardar</Button>}
        trigger={<Button variant="outline"><EditIcon/></Button>}>
        <EventWrapper id={id} setOpen={setOpen} setIsLoading={setIsLoading} setLoadingContent={setLoadingContent}
                      user={user}/>
    </Dialog>)
}

const schema = yup.object({
    typeId: yup.string().required('El tipo de cita es requerido'),
    customer: yup.object({
        name: yup.string().required('El nombre es requerido'),
        identification: yup.string().required('La cédula es requerida'),
        phone: yup.string()
            .matches(/^\d{4}-\d{4}$/, {
                message: 'La placa debe tener el formato correcto',
            }).required('El teléfono es requerido'),
        schedule: yup.object({
            startTime: yup.string().required('La hora de inicio es requerida'),
        }).required(),
    }).required(),
    locationId: yup.string().required('La sede es requerida'),
    licenseTypeId: yup.string().required('El tipo de licencia es requerido'),
    date: yup.string().required('La fecha es requerida'),
    startTime: yup.string().required('La hora de inicio es requerida'),
    endTime: yup.string().required('La hora de finalización es requerida'),
    instructorId: yup.string(),
    assetId: yup.string(),
    createdById: yup.string(),
    payment: yup.object({
        price: yup.string(), cashAdvance: yup.string(), paid: yup.string(),
    }).required(),
}).required();
interface EventWrapperProps {
    id: number;
    setOpen: (open: boolean) => void;
    setIsLoading: (loading: boolean) => void;
    setLoadingContent: (content: React.ReactNode) => void;
    user: IUser;
}

const EventWrapper = (props: EventWrapperProps) => {
    const {id, setOpen, setLoadingContent, setIsLoading, user} = props;
    const {data, isLoading} = useGetEventById(id);
    const {mutateAsync, isLoading: isUpdateLoading} = useUpdateMutation();
    const router = useRouter();

    const onSubmit = useCallback((data: IEventForm) => {
        setLoadingContent(<FormSavingLoader message="Guardando información de la Cita"/>);
        setIsLoading(true);
        mutateAsync(data).then(() => {
            setOpen(false);
            router.refresh();
        });
    }, []);

    useEffect(() => {
        if (!isLoading) {
            setIsLoading(false);
        }
    }, [isLoading]);

    if (isLoading || isUpdateLoading) {
        return null;
    }

    const [startTime, endTime] = useMemo(() => {
        if (data?.typeId === 1) {
            const dataStartDate = data?.customer?.schedule.startDate;
            const dataEndDate = data?.customer?.schedule.endDate;
            return [dayjs(dataStartDate).format('HH:mm'), dayjs(dataEndDate).format('HH:mm')];
        } else {
            const dataStartDate = data?.date;
            return [dayjs(dataStartDate).format('HH:mm')];
        }
    }, [data]);

    const initialValues = {
        id: data?.id,
        typeId: data?.typeId,
        customer: {
            name: data?.customer?.name,
            identification: data?.customer?.identification,
            phone: data?.customer?.phone,
            schedule: {
                startTime: dayjs(data?.customer?.schedule.startDate).format('HH:mm'),
            }
        },
        locationId: data?.locationId,
        licenseTypeId: data?.licenseTypeId,
        date: data?.date || dayjs(),
        startTime: startTime,
        endTime: endTime,
        instructorId: data?.instructorId,
        assetId: data?.assetId,
        createdById: user.id,
        payment: {
            price: data?.payment?.price, cashAdvance: data?.payment?.cashAdvance, paid: data?.payment?.paid,
        },
    }

    return <Form
        initialValues={initialValues}
        onSubmit={onSubmit}
        validateOnBlur={true}
        validate={formValidator(schema)}
        mutators={{
            clearFieldValue: ([fieldName], state, { changeValue }) => {
                changeValue(state, fieldName, () => undefined);
            },
        }}
    >
        {(formProps) => <EventForm {...formProps} />}
    </Form>
}