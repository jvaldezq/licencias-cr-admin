'use client';

import {useCallback, useState} from "react";
import {Field, Form, FormRenderProps, SupportedInputs} from "react-final-form";
import {FormInput} from "@/components/Forms/Input/FormInput";
import {Button} from "@/components/ui/button";
import {Dialog} from "@/components/Dialog";
import * as React from "react";
import {QueryCache, QueryClient, QueryClientProvider} from "react-query";
import {useCreateMutation, useGetAssetById, useGetLocationList, useUpdateMutation} from "@/app/assets/clientService";
import {useRouter} from "next/navigation";
import {Loader} from "@/components/Loader";
import {FormSwitch} from "@/components/Forms/Switch/FormSwitch";
import {FormDropdown} from "@/components/Forms/Dropdown/FormDropdown";
import {EditIcon} from "@/assets/icons/EditIcon";

export interface AssetForm {
    name: string;
    plate: string;
    status: boolean;
    locationId: number;
}

export interface FormProps extends FormRenderProps<AssetForm> {
}

const MainForm = (props: FormProps) => {
    const {handleSubmit} = props;
    const {data, isLoading} = useGetLocationList();

    return <form id="asset-form" onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6 py-4">
        <Field
            name="name"
            component={FormInput as unknown as SupportedInputs}
            placeholder='Nombre'
            label='Nombre'
            autoFocus={true}
            validate={value => (value ? undefined : 'Requerido')}
        />
        <Field
            name="plate"
            component={FormInput as unknown as SupportedInputs}
            placeholder='Placa'
            label='Placa'
            validate={value => (value ? undefined : 'Requerido')}
        />
        <Field
            name="locationId"
            component={FormDropdown as unknown as SupportedInputs}
            placeholder='Sede'
            label='Sede'
            options={data || []}
            isLoading={isLoading}
        />
        <Field
            name="status"
            component={FormSwitch as unknown as SupportedInputs}
            placeholder='Activo'
            label='Activo'
        />
    </form>
}

function CreateAsset() {
    const [open, setOpen] = useState(false);
    const {mutateAsync, isLoading} = useCreateMutation();
    const router = useRouter();

    const onSubmit = useCallback((data: AssetForm) => {
        mutateAsync(data).then(() => {
            router.refresh();
            setOpen(false);
        });
    }, []);

    return (<Dialog
        open={open}
        onOpenChange={setOpen}
        title="Creación de Vehículo"
        footer={isLoading ? null : <Button
            type="submit" form="asset-form"
            className="bg-secondary text-white rounded-3xl animate-fade-right animate-once animate-duration-500 animate-delay-100 animate-ease-in">Crear</Button>}
        trigger={<Button
            className="bg-secondary text-white rounded-3xl animate-fade-left animate-once animate-duration-500 animate-delay-100 animate-ease-in">Crear</Button>}>
        {isLoading ? <div className="flex flex-col gap-4 justify-center items-center py-4">
            <Loader/>
            <p className="text-sm">Creando una nuevo Vehículo</p>
        </div> : <Form
            initialValues={{
                name: undefined, plate: undefined, status: true, locationId: undefined
            }}
            onSubmit={onSubmit}
        >
            {(formProps) => <MainForm {...formProps} />}
        </Form>}
    </Dialog>)
}

function EditAsset({id}: { id: number }) {
    const [open, setOpen] = useState(false);
    const {mutateAsync, isLoading} = useUpdateMutation();
    const {data} = useGetAssetById(id);
    const router = useRouter();

    const onSubmit = useCallback((data: AssetForm) => {
        mutateAsync(data).then(() => {
            router.refresh();
            setOpen(false);
        });
    }, []);

    const initialValues = data || {
        name: undefined, plate: undefined, status: true, locationId: undefined
    }

    return (<Dialog
        open={open}
        onOpenChange={setOpen}
        title="Creación de Vehículo"
        footer={isLoading ? null : <Button
            type="submit" form="asset-form"
            className="bg-secondary text-white rounded-3xl animate-fade-right animate-once animate-duration-500 animate-delay-100 animate-ease-in">Editar</Button>}
        trigger={<Button variant="outline"><EditIcon /></Button>}>
        {isLoading ? <div className="flex flex-col gap-4 justify-center items-center py-4">
            <Loader/>
            <p className="text-sm">Creando una nuevo Vehículo</p>
        </div> : <Form
            initialValues={initialValues}
            onSubmit={onSubmit}
        >
            {(formProps) => <MainForm {...formProps} />}
        </Form>}
    </Dialog>)
}


export function CreateAssetWrapper() {
    const queryClient = new QueryClient({
        queryCache: new QueryCache({
            onError: error => {
                console.error('Error:', error)
            }
        })
    });

    return <QueryClientProvider client={queryClient}>
        <CreateAsset/>
    </QueryClientProvider>
}

export function EditAssetWrapper({id}: { id: number }) {
    const queryClient = new QueryClient({
        queryCache: new QueryCache({
            onError: error => {
                console.error('Error:', error)
            }
        })
    });

    return <QueryClientProvider client={queryClient}>
        <EditAsset id={id}/>
    </QueryClientProvider>
}