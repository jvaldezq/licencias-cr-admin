'use client';

import {useCallback, useEffect, useState} from "react";
import {Form} from "react-final-form";
import {Button} from "@/components/ui/button";
import {Dialog} from "@/components/Dialog";
import * as React from "react";
import {useCreateMutation} from "@/app/events/services/client";
import {useRouter} from "next/navigation";
import {FormSavingLoader} from "@/components/FormLoader";
import {formValidator} from "@/lib/formValidator";
import * as yup from "yup";
import {EventForm} from "@/app/events/forms/EventsForm";
import {IEventForm, IUser} from "@/lib/definitions";
import dayjs from "dayjs";

interface CreateEventProps {
    user: IUser;
}

export const CreateEvent = (props: CreateEventProps) => {
    const {user} = props;
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingContent, setLoadingContent] = useState<React.ReactNode>(null);

    return (<Dialog
        open={open}
        onOpenChange={setOpen}
        title="Creación de Cita"
        isLoading={isLoading}
        loadingContent={loadingContent}
        footer={<Button
            type="submit" form="event-form"
            className="bg-secondary text-white rounded-3xl animate-fade-right animate-once animate-duration-500 animate-delay-100 animate-ease-in">Crear</Button>}
        trigger={<Button
            className="bg-secondary text-white rounded-3xl animate-fade-left animate-once animate-duration-500 animate-delay-100 animate-ease-in">Crear</Button>}>
        <EventWrapper setOpen={setOpen} setIsLoading={setIsLoading} setLoadingContent={setLoadingContent}
                      user={user}/>
    </Dialog>)
}

const schema = yup.object({
    typeId: yup.string().required('El tipo de cita es requerido'),
    customer: yup.object({
        name: yup.string().required('El nombre es requerido'),
        identification: yup.string().matches(/^\d-\d{4}-\d{4}$/, {
            message: 'La cédula debe tener el formato correcto',
        }).required('La cédula es requerida'),
        phone: yup.string()
            .matches(/^\d{4}-\d{4}$/, {
                message: 'El teléfono debe tener el formato correcto',
            }).required('El teléfono es requerido'),
        schedule: yup.object({
            startTime: yup.string().required('La hora de inicio es requerida'),
        }).required('El horario es requerido'),
    }).required(),
    locationId: yup.string().required('La sede es requerida'),
    licenseTypeId: yup.string().required('El tipo de licencia es requerido'),
    date: yup.string().required('La fecha es requerida'),
    startTime: yup.string().required('La hora de inicio es requerida'),
    endTime: yup.string().required('La hora de finalización es requerida'),
    payment: yup.object({
        price: yup.number(),
        cashAdvance: yup.number(),
        paid: yup.string(),
    }).required('El pago es requerido'),
}).required();


interface EventWrapperProps {
    setOpen: (open: boolean) => void;
    setIsLoading: (loading: boolean) => void;
    setLoadingContent: (content: React.ReactNode) => void;
    user: IUser;
}

const EventWrapper = (props: EventWrapperProps) => {
    const {setOpen, setLoadingContent, setIsLoading, user} = props;
    const {mutateAsync, isLoading} = useCreateMutation();
    const router = useRouter();

    const onSubmit = useCallback((data: IEventForm) => {
        setLoadingContent(<FormSavingLoader message="Creando nueva cita"/>);
        setIsLoading(true);
        mutateAsync(data).then(() => {
            router.refresh();
            setOpen(false);
        });
    }, []);

    useEffect(() => {
        if (!isLoading) {
            setIsLoading(false);
        }
    }, [isLoading]);

    if (isLoading) {
        return null;
    }

    const initialValues = {
        typeId: undefined,
        customer: {
            name: undefined, identification: undefined, phone: undefined, schedule: {
                startTime: undefined,
            }
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
            price: undefined, cashAdvance: undefined, paid: false,
        }
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