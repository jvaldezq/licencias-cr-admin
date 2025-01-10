'use client';

import {useCallback, useEffect, useState} from "react";
import {Form} from "react-final-form";
import {Button} from "@/components/ui/button";
import {Dialog} from "@/components/Dialog";
import * as React from "react";
import {useGetLicenseList, useGetSchoolById, useUpdateMutation} from "@/app/schools/services/client";
import {useRouter} from "next/navigation";
import {EditIcon} from "@/assets/icons/EditIcon";
import {SchoolForm, SchoolFormProps} from "@/app/schools/forms/SchoolForm";
import {FormSavingLoader} from "@/components/FormLoader";
import arrayMutators from 'final-form-arrays'
import {ISchoolPrices} from "@/lib/definitions";

export const EditSchool = ({id}: { id: string }) => {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [loadingContent, setLoadingContent] = useState<React.ReactNode>(<FormSavingLoader
        message="Cargando información de la Escuela"/>);

    useEffect(() => {
        if (!open) {
            setIsLoading(true);
        }
    }, [open]);

    return (<Dialog
        open={open}
        onOpenChange={setOpen}
        title="Actualizando Escuela"
        isLoading={isLoading}
        loadingContent={loadingContent}
        footer={<Button
            type="submit" form="school-form"
            className="bg-secondary text-white rounded-3xl animate-fade-right animate-once animate-duration-500 animate-delay-100 animate-ease-in">Guardar</Button>}
        trigger={<Button variant="outline"><EditIcon/></Button>}>
        <SchoolWrapper id={id} setOpen={setOpen} setIsLoading={setIsLoading} setLoadingContent={setLoadingContent}/>
    </Dialog>)
}

interface SchoolWrapperProps {
    id: string;
    setOpen: (open: boolean) => void;
    setIsLoading: (loading: boolean) => void;
    setLoadingContent: (content: React.ReactNode) => void;
}

const SchoolWrapper = (props: SchoolWrapperProps) => {
    const {id, setOpen, setLoadingContent, setIsLoading} = props;
    const {data, isLoading} = useGetSchoolById(id);
    const {mutateAsync, isLoading: isUpdateLoading} = useUpdateMutation();
    const {data: licenses } = useGetLicenseList();
    const router = useRouter();

    const onSubmit = useCallback((data: SchoolFormProps) => {
        setLoadingContent(<FormSavingLoader message="Guardando información del Escuela"/>);
        setIsLoading(true);
        mutateAsync(data).then(() => {
            setOpen(false);
            router.refresh();
        });
    }, [mutateAsync, router, setIsLoading, setLoadingContent, setOpen]);

    useEffect(() => {
        if (!isLoading) {
            setIsLoading(false);
        }
    }, [isLoading, setIsLoading]);

    if (isLoading || isUpdateLoading) {
        return null;
    }

    const initialValues = {
        ...data,
        schoolPrices: data?.schoolPrices?.map((license: ISchoolPrices) => ({
            ...license,
            name: licenses?.find(val => val?.id === license?.licenseTypeId)?.name,
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