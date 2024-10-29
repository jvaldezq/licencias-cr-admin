'use client';

import {useCallback, useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {Dialog} from "@/components/Dialog";
import * as React from "react";
import {useRouter} from "next/navigation";
import {FormSavingLoader} from "@/components/FormLoader";
import {useCompleteMutation, useGetEventById} from "@/app/events/services/client";
import {MoneyIcon} from "@/assets/icons/MoneyIcon";
import {CRCFormatter} from "@/lib/NumberFormats";
import {Form} from "react-final-form";

export const CompleteEvent = ({id}: { id: string }) => {
    const [open, setOpen] = useState(false);
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
            type="submit" form="event-form"
            className="bg-secondary text-white rounded-3xl animate-fade-right animate-once animate-duration-500 animate-delay-100 animate-ease-in">Completar</Button>}
        trigger={<Button variant="outline"><MoneyIcon/></Button>}>
        <EventWrapper id={id} setOpen={setOpen} setIsLoading={setIsLoading} setLoadingContent={setLoadingContent}/>
    </Dialog>)
}

interface EventWrapperProps {
    id: string;
    setOpen: (open: boolean) => void;
    setIsLoading: (loading: boolean) => void;
    setLoadingContent: (content: React.ReactNode) => void;
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

    const onSubmit = useCallback(() => {
        setIsLoading(true);
        setLoadingContent(<FormSavingLoader message="Completando Cita"/>)
        mutateAsync(id).then(() => {
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

    return <Form
        initialValues={undefined}
        onSubmit={onSubmit}
        mutators={{
            clearFieldValue: ([fieldName], state, {changeValue}) => {
                changeValue(state, fieldName, () => undefined);
            },
        }}
    >
        {(formProps) => <form id="event-form" onSubmit={formProps.handleSubmit}
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
        </form>}
    </Form>
}