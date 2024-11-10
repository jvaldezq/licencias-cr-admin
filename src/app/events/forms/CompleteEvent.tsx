'use client';

import {useCallback, useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {Dialog} from "@/components/Dialog";
import * as React from "react";
import {useRouter} from "next/navigation";
import {FormSavingLoader} from "@/components/FormLoader";
import {useCompleteMutation, useGetEventById} from "@/app/events/services/client";
import {CRCFormatter} from "@/lib/NumberFormats";
import {Field, Form, SupportedInputs} from "react-final-form";
import {PAYMENT_TYPE} from "@/lib/definitions";
import {FormDropdown} from "@/components/Forms/Dropdown/FormDropdown";

interface CompleteEventProps {
    id: string;
    open: boolean;
    setOpen: (open: boolean) => void;
}

export const CompleteEvent = (props: CompleteEventProps) => {
    const {id, setOpen, open} = props;
    const [isLoading, setIsLoading] = useState(true);
    const [loadingContent, setLoadingContent] = useState<React.ReactNode>(<FormSavingLoader
        message="Cargando..."/>);

    useEffect(() => {
        if (!open) {
            setIsLoading(true);
        }
    }, [open]);

    return (<Dialog
        open={open}
        onOpenChange={setOpen}
        title="Completar Cita"
        isLoading={isLoading}
        loadingContent={loadingContent}
        footer={<Button
            type="submit" form="event-complete-form"
            className="bg-secondary text-white rounded-3xl animate-fade-right animate-once animate-duration-500 animate-delay-100 animate-ease-in">Completar</Button>}
        trigger={null}
    >
        <EventWrapper id={id} setOpen={setOpen} setIsLoading={setIsLoading} setLoadingContent={setLoadingContent}/>
    </Dialog>)
}

interface EventWrapperProps {
    id: string;
    setOpen: (open: boolean) => void;
    setIsLoading: (loading: boolean) => void;
    setLoadingContent: (content: React.ReactNode) => void;
}

interface IFormProps {
    type: PAYMENT_TYPE;
}

const EventWrapper = (props: EventWrapperProps) => {
    const {id, setOpen, setLoadingContent, setIsLoading} = props;
    const {data, isLoading} = useGetEventById(id);
    const {mutateAsync, isLoading: isCompleteLoading} = useCompleteMutation();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading) {
            setIsLoading(false);
        }
    }, [isLoading, setIsLoading]);

    const onSubmit = useCallback((data: IFormProps) => {
        setIsLoading(true);
        setLoadingContent(<FormSavingLoader message="Completando Cita"/>)
        mutateAsync({id, type: data.type}).then(() => {
            setOpen(false);
            router.refresh();
        });
    }, [id, mutateAsync, router, setIsLoading, setLoadingContent, setOpen]);

    if (isLoading || isCompleteLoading) {
        return null;
    }

    const price = data?.payment?.price || 0;
    const cashAdvance = data?.payment?.cashAdvance || 0;
    const amountToPay = price - cashAdvance;

    const initialValues = {
        type: PAYMENT_TYPE.CASH,
    }

    const options = [{name: 'Efectivo', id: PAYMENT_TYPE.CASH}, {
        name: 'Tarjeta', id: PAYMENT_TYPE.CARD
    }, {name: 'Sinpe', id: PAYMENT_TYPE.SINPE},]

    return <Form
        initialValues={initialValues}
        onSubmit={onSubmit}
    >
        {(formProps) => <form id="event-complete-form" onSubmit={formProps.handleSubmit}
                              className="flex flex-col gap-4 items-center w-full">
            <div className="w-full border-b border-solid border-primary py-2">
                <p className="text-primary/[0.7] text-sm">Cliente</p>
                <p className="font-semibold text-primary">{data?.customer?.name}</p>
            </div>

            <div className="flex justify-between items-center gap-2 w-full">
                <p className="font-semibold text-primary/[0.9]">Monto Total</p>
                <p className="font-semibold text-primary">{CRCFormatter(price)}</p>
            </div>

            <div className="flex justify-between items-center gap-2 w-full">
                <p className="font-semibold text-primary/[0.9]">Adelanto</p>
                <p className="font-semibold text-success">{CRCFormatter(cashAdvance)}</p>
            </div>

            <div className="flex justify-between items-center gap-2 w-full bg-error/[0.2] p-4 rounded-2xl">
                <p className="font-semibold text-primary/[0.9]">Pendiente</p>
                <p className="font-bold text-error">{CRCFormatter(amountToPay)}</p>
            </div>

            <div className="w-full border-t border-solid border-primary py-2">
                <p className="text-primary/[0.7] text-sm">Comentarios</p>
                <p className="font-semibold text-primary">{data?.notes ?? '-'}</p>
            </div>

            <div className="border-t border-solid border-primary w-full py-2">
                <Field
                    name="type"
                    component={FormDropdown as unknown as SupportedInputs}
                    placeholder='Tipo de pago'
                    label='Tipo de pago'
                    options={options}
                    wrapperClassName="w-full"
                    validate={(value) => value !== undefined ? undefined : 'El tipo de pago es requerido'}
                />
            </div>
        </form>}
    </Form>
}