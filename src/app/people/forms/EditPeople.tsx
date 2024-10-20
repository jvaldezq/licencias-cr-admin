'use client';

import {useCallback, useEffect, useState} from "react";
import {Form} from "react-final-form";
import {Button} from "@/components/ui/button";
import {Dialog} from "@/components/Dialog";
import * as React from "react";
import {useGetPeopleById, useUpdateMutation} from "@/app/people/services/client";
import {useRouter} from "next/navigation";
import {EditIcon} from "@/assets/icons/EditIcon";
import {FormSavingLoader} from "@/components/FormLoader";
import {PeopleForm, PeopleFormProps} from "@/app/people/forms/PeopleForm";
import * as yup from "yup";
import {formValidator} from "@/lib/formValidator";

interface EditPeopleProps {
    id: number;
}

export const EditPeople = (props: EditPeopleProps) => {
    const {id} = props;
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [loadingContent, setLoadingContent] = useState<React.ReactNode>(<FormSavingLoader
        message="Cargando información del empleado"/>);

    useEffect(() => {
        if (!open) {
            setIsLoading(true);
        }
    }, [open]);

    return (<Dialog
        open={open}
        onOpenChange={setOpen}
        title="Actualizando empleado"
        isLoading={isLoading}
        loadingContent={loadingContent}
        footer={<Button
            type="submit" form="people-form"
            className="bg-secondary text-white rounded-3xl animate-fade-right animate-once animate-duration-500 animate-delay-100 animate-ease-in">Guardar</Button>}
        trigger={<Button variant="outline"><EditIcon/></Button>}
    >
        <PeopleFormWrapper id={id} setOpen={setOpen} setIsLoading={setIsLoading} setLoadingContent={setLoadingContent}/>
    </Dialog>)
}

const schema = yup.object({
    name: yup.string().required('El nombre es requerido'),
    location: yup.object({
        id: yup.string().required('La sede es requerida'),
    }).required(),
}).required();


interface PeopleFormWrapperProps {
    id: number;
    setOpen: (open: boolean) => void;
    setIsLoading: (loading: boolean) => void;
    setLoadingContent: (content: React.ReactNode) => void;
}

const PeopleFormWrapper = (props: PeopleFormWrapperProps) => {
    const {id, setOpen, setLoadingContent, setIsLoading} = props;
    const {data, isLoading} = useGetPeopleById(id);
    const {mutateAsync, isLoading: isUpdateLoading} = useUpdateMutation();
    const router = useRouter();

    const onSubmit = useCallback((data: PeopleFormProps) => {
        setLoadingContent(<FormSavingLoader message="Guardando información del empleado"/>);
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
        validateOnBlur={true}
        validate={formValidator(schema)}
    >
        {(formProps) => <PeopleForm {...formProps} />}
    </Form>
}