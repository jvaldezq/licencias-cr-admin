'use client';

import {useCallback, useState} from "react";
import {Field, Form, FormRenderProps, SupportedInputs} from "react-final-form";
import {FormInput} from "@/components/Forms/Input/FormInput";
import {FormSwitch} from "@/components/Forms/Switch/FormSwitch";
import {Button} from "@/components/ui/button";
import {Dialog} from "@/components/Dialog";
import * as React from "react";
import {QueryCache, QueryClient, QueryClientProvider} from "react-query";
import {useCreateMutation, useGetLocationById, useUpdateMutation} from "@/app/locations/clientService";
import {useRouter} from "next/navigation";
import {Loader} from "@/components/Loader";
import {EditIcon} from "@/assets/icons/EditIcon";

export interface LocationForm {
    name: string;
    status: boolean;
}

export interface FormProps extends FormRenderProps<LocationForm> {
}

const MainForm = (props: FormProps) => {
    const {handleSubmit} = props;

    return <form id="location-form" onSubmit={handleSubmit} className="flex flex-col gap-6 py-4">
        <Field
            name="name"
            component={FormInput as unknown as SupportedInputs}
            placeholder='Nombre'
            label='Nombre'
            autoFocus={true}
            validate={value => (value ? undefined : 'Requerido')}
        />
        <Field
            name="status"
            component={FormSwitch as unknown as SupportedInputs}
            placeholder='Activo'
            label='Activo'
        />
    </form>
}

export function CreateLocation() {
    const [open, setOpen] = useState(false);
    const {mutateAsync, isLoading} = useCreateMutation();
    const router = useRouter();

    const onSubmit = useCallback((data: LocationForm) => {
        mutateAsync(data).then(() => {
            router.refresh();
            setOpen(false);
        });
    }, []);

    return (<Dialog
        open={open}
        onOpenChange={setOpen}
        title="Creación de Sede"
        footer={isLoading ? null : <Button
            type="submit" form="location-form"
            className="bg-secondary text-white rounded-3xl animate-fade-right animate-once animate-duration-500 animate-delay-100 animate-ease-in">Crear</Button>}
        trigger={<Button
            className="bg-secondary text-white rounded-3xl animate-fade-left animate-once animate-duration-500 animate-delay-100 animate-ease-in">Crear</Button>}>
        {isLoading ? <div className="flex flex-col gap-4 justify-center items-center py-4">
            <Loader/>
            <p className="text-sm">Creando una nueva Sede</p>
        </div> : <Form
            initialValues={{
                name: undefined,
                status: true
            }}
            onSubmit={onSubmit}
        >
            {(formProps) => <MainForm {...formProps} />}
        </Form>}
    </Dialog>)
}

export function EditLocation({id}: { id: number }) {
    const [open, setOpen] = useState(false);
    const {mutateAsync, isLoading} = useUpdateMutation();
    const {data} = useGetLocationById(id);
    const router = useRouter();

    const onSubmit = useCallback((data: LocationForm) => {
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
        title="Creación de Sede"
        footer={isLoading ? null : <Button
            type="submit" form="location-form"
            className="bg-secondary text-white rounded-3xl animate-fade-right animate-once animate-duration-500 animate-delay-100 animate-ease-in">Editar</Button>}
        trigger={<Button variant="outline"><EditIcon /></Button>}>
        {isLoading ? <div className="flex flex-col gap-4 justify-center items-center py-4">
            <Loader/>
            <p className="text-sm">Creando una nueva Sede</p>
        </div> : <Form
            initialValues={initialValues}
            onSubmit={onSubmit}
        >
            {(formProps) => <MainForm {...formProps} />}
        </Form>}
    </Dialog>)
}


export function CreateLocationWrapper() {
    const queryClient = new QueryClient({
        queryCache: new QueryCache({
            onError: error => {
                console.error('Error:', error)
            }
        })
    });

    return <QueryClientProvider client={queryClient}>
        <CreateLocation/>
    </QueryClientProvider>
}

export function EditLocationWrapper({id}: { id: number }) {
    const queryClient = new QueryClient({
        queryCache: new QueryCache({
            onError: error => {
                console.error('Error:', error)
            }
        })
    });

    return <QueryClientProvider client={queryClient}>
        <EditLocation id={id}/>
    </QueryClientProvider>
}