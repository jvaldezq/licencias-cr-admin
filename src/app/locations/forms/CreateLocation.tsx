'use client';

import {useCallback, useEffect, useState} from "react";
import {Form} from "react-final-form";
import {Button} from "@/components/ui/button";
import {Dialog} from "@/components/Dialog";
import * as React from "react";
import {useCreateMutation} from "@/app/locations/services/client";
import {useRouter} from "next/navigation";
import {LocationForm, LocationFormProps} from "@/app/locations/forms/LocationForm";
import {FormSavingLoader} from "@/components/FormLoader";

export const CreateLocation = () => {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingContent, setLoadingContent] = useState<React.ReactNode>(null);

    return (<Dialog
        open={open}
        onOpenChange={setOpen}
        title="Creación de Sede"
        isLoading={isLoading}
        loadingContent={loadingContent}
        footer={<Button
            type="submit" form="location-form"
            className="bg-secondary text-white rounded-3xl animate-fade-right animate-once animate-duration-500 animate-delay-100 animate-ease-in">Crear</Button>}
        trigger={<Button
            className="bg-secondary text-white rounded-3xl animate-fade-left animate-once animate-duration-500 animate-delay-100 animate-ease-in">Crear</Button>}>
        <LocationFormWrapper setOpen={setOpen} setIsLoading={setIsLoading} setLoadingContent={setLoadingContent}/>
    </Dialog>)
}

interface LocationFormWrapperProps {
    setOpen: (open: boolean) => void;
    setIsLoading: (loading: boolean) => void;
    setLoadingContent: (content: React.ReactNode) => void;
}

const LocationFormWrapper = (props: LocationFormWrapperProps) => {
    const {setOpen, setLoadingContent, setIsLoading} = props;
    const {mutateAsync, isLoading} = useCreateMutation();
    const router = useRouter();

    const onSubmit = useCallback((data: LocationFormProps) => {
        setLoadingContent(<FormSavingLoader message="Creando nueva Sede"/>);
        setIsLoading(true);
        mutateAsync(data).then(() => {
            router.refresh();
            setOpen(false);
        });
    }, [mutateAsync, router, setIsLoading, setLoadingContent, setOpen]);

    useEffect(() => {
        if (!isLoading) {
            setIsLoading(false);
        }
    }, [isLoading, setIsLoading]);

    if (isLoading) {
        return null;
    }

    const initialValues = {
        name: undefined, status: true
    }

    return <Form
        initialValues={initialValues}
        onSubmit={onSubmit}
    >
        {(formProps) => <LocationForm {...formProps} />}
    </Form>
}