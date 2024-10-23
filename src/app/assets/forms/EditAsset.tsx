'use client';

import {useCallback, useEffect, useState} from "react";
import {Form} from "react-final-form";
import {Button} from "@/components/ui/button";
import {Dialog} from "@/components/Dialog";
import * as React from "react";
import {useGetAssetById, useUpdateMutation} from "@/app/assets/services/client";
import {useRouter} from "next/navigation";
import {EditIcon} from "@/assets/icons/EditIcon";
import {AssetForm, AssetFormProps} from "@/app/assets/forms/AssetForm";
import {FormSavingLoader} from "@/components/FormLoader";
import * as yup from "yup";
import {formValidator} from "@/lib/formValidator";

export const EditAsset = ({id}: { id: number }) => {
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
        title="Actualizando Vehículo"
        isLoading={isLoading}
        loadingContent={loadingContent}
        footer={<Button
            type="submit" form="asset-form"
            className="bg-secondary text-white rounded-3xl animate-fade-right animate-once animate-duration-500 animate-delay-100 animate-ease-in">Guardar</Button>}
        trigger={<Button variant="outline"><EditIcon/></Button>}>
        <AssetWrapper id={id} setOpen={setOpen} setIsLoading={setIsLoading} setLoadingContent={setLoadingContent}/>
    </Dialog>)
}

const schema = yup.object({
    name: yup.string().required('El nombre es requerido'),
    plate: yup.string().required('La placa es requerida'),
    locationId: yup.number().required('La sede es requerida'),
    licenseTypeId: yup.number().required('El tipo de licencia es requerido'),
}).required();

interface AssetWrapperProps {
    id: number;
    setOpen: (open: boolean) => void;
    setIsLoading: (loading: boolean) => void;
    setLoadingContent: (content: React.ReactNode) => void;
}

const AssetWrapper = (props: AssetWrapperProps) => {
    const {id, setOpen, setLoadingContent, setIsLoading} = props;
    const {data, isLoading} = useGetAssetById(Number(id));
    const {mutateAsync, isLoading: isUpdateLoading} = useUpdateMutation();
    const router = useRouter();

    const onSubmit = useCallback((data: AssetFormProps) => {
        setLoadingContent(<FormSavingLoader message="Guardando información del Vehículo"/>);
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
        {(formProps) => <AssetForm {...formProps} />}
    </Form>
}