'use client';

import {useCallback, useEffect, useState} from "react";
import {Form} from "react-final-form";
import {Button} from "@/components/ui/button";
import {Dialog} from "@/components/Dialog";
import * as React from "react";
import {useRouter} from "next/navigation";
import {FormSavingLoader} from "@/components/FormLoader";
import {SchoolForm, SchoolFormProps} from "@/app/schools/forms/SchoolForm";
import {useCreateMutation, useGetLicenseList} from "@/app/schools/services/client";
import arrayMutators from 'final-form-arrays'
import {ILicenseType} from "@/lib/definitions";

export const CreateSchool = () => {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingContent, setLoadingContent] = useState<React.ReactNode>(null);

    return (<Dialog
        open={open}
        onOpenChange={setOpen}
        title="Creación de Escuela"
        isLoading={isLoading}
        loadingContent={loadingContent}
        footer={<Button
            type="submit" form="school-form"
            className="bg-secondary text-white rounded-3xl animate-fade-right animate-once animate-duration-500 animate-delay-100 animate-ease-in">Crear</Button>}
        trigger={<Button
            className="bg-secondary text-white rounded-3xl animate-fade-left animate-once animate-duration-500 animate-delay-100 animate-ease-in">Crear</Button>}>
        <SchoolFormWrapper setOpen={setOpen} setIsLoading={setIsLoading} setLoadingContent={setLoadingContent}/>
    </Dialog>)
}

interface SchoolFormWrapperProps {
    setOpen: (open: boolean) => void;
    setIsLoading: (loading: boolean) => void;
    setLoadingContent: (content: React.ReactNode) => void;
}

const SchoolFormWrapper = (props: SchoolFormWrapperProps) => {
    const {setOpen, setLoadingContent, setIsLoading} = props;
    const {mutateAsync, isLoading} = useCreateMutation();
    const {data: licenses } = useGetLicenseList();
    const router = useRouter();

    const onSubmit = useCallback((data: SchoolFormProps) => {
        setLoadingContent(<FormSavingLoader message="Creando un nuevo Escuela"/>);
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
        name: undefined,
        status: true,
        schoolPrices: licenses?.map((license: ILicenseType) => ({
            licenseTypeId: license.id,
            name: license.name,
            internalPrice: "",
            externalPrice: "",
        })) || [],
    }

    return <Form
        initialValues={initialValues}
        onSubmit={onSubmit}
        mutators={{
            ...arrayMutators
        }}
    >
        {(formProps) => <SchoolForm {...formProps} />}
    </Form>
}