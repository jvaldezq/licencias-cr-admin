'use client';

import {useCallback, useEffect, useState} from "react";
import {Form} from "react-final-form";
import {Button} from "@/components/ui/button";
import {Dialog} from "@/components/Dialog";
import * as React from "react";
import {useGetLocationById, useUpdateMutation} from "@/app/locations/services/client";
import {useRouter} from "next/navigation";
import {EditIcon} from "@/assets/icons/EditIcon";
import {LocationForm, LocationFormProps} from "@/app/locations/forms/LocationForm";
import {FormSavingLoader} from "@/components/FormLoader";

export const EditLocation = ({id}: { id: number }) => {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [loadingContent, setLoadingContent] = useState<React.ReactNode>(<FormSavingLoader
        message="Cargando información de la Sede"/>);

    useEffect(() => {
        if (!open) {
            setIsLoading(true);
        }
    }, [open]);

    return (<Dialog
        open={open}
        onOpenChange={setOpen}
        title="Actualizando Sede"
        isLoading={isLoading}
        loadingContent={loadingContent}
        footer={<Button
            type="submit" form="location-form"
            className="bg-secondary text-white rounded-3xl animate-fade-right animate-once animate-duration-500 animate-delay-100 animate-ease-in">Guardar</Button>}
        trigger={<Button variant="outline"><EditIcon/></Button>}>
        <LocationWrapper id={id} setOpen={setOpen} setIsLoading={setIsLoading} setLoadingContent={setLoadingContent}/>
    </Dialog>)
}

interface LocationWrapperProps {
    id: number;
    setOpen: (open: boolean) => void;
    setIsLoading: (loading: boolean) => void;
    setLoadingContent: (content: React.ReactNode) => void;
}

const LocationWrapper = (props: LocationWrapperProps) => {
    const {id, setOpen, setLoadingContent, setIsLoading} = props;
    const {data, isLoading} = useGetLocationById(id);
    const {mutateAsync, isLoading: isUpdateLoading} = useUpdateMutation();
    const router = useRouter();

    const onSubmit = useCallback((data: LocationFormProps) => {
        setLoadingContent(<FormSavingLoader message="Guardando información de la Sede"/>);
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

    return <Form
        initialValues={data}
        onSubmit={onSubmit}
    >
        {(formProps) => <LocationForm {...formProps} />}
    </Form>
}