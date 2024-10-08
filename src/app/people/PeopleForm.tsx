'use client';

import {useCallback, useState} from "react";
import {Field, Form, FormRenderProps, SupportedInputs} from "react-final-form";
import {FormInput} from "@/components/Forms/Input/FormInput";
import {Button} from "@/components/ui/button";
import {Dialog} from "@/components/Dialog";
import * as React from "react";
import {QueryCache, QueryClient, QueryClientProvider} from "react-query";
import {useCreateMutation, useGetPeopleById, useUpdateMutation} from "@/app/people/clientService";
import {useRouter} from "next/navigation";
import {Loader} from "@/components/Loader";
import {useGetAssetById} from "@/app/assets/clientService";
import {EditIcon} from "@/assets/icons/EditIcon";

export interface PeopleForm {
    name: string;
    color: string;
}

export interface FormProps extends FormRenderProps<PeopleForm> {
}

const MainForm = (props: FormProps) => {
    const {handleSubmit} = props;

    return <form id="people-form" onSubmit={handleSubmit} className="flex flex-col gap-6 py-4">
        <Field
            name="name"
            component={FormInput as unknown as SupportedInputs}
            placeholder='Nombre'
            label='Nombre'
            autoFocus={true}
            validate={value => (value ? undefined : 'Requerido')}
        />
        <Field
            name="color"
            component={FormInput as unknown as SupportedInputs}
            placeholder='Color'
            label='Color'
            type="color"
            validate={value => (value ? undefined : 'Requerido')}
        />
    </form>
}

export function CreatePeople() {
    const [open, setOpen] = useState(false);
    const {mutateAsync, isLoading} = useCreateMutation();
    const router = useRouter();

    const onSubmit = useCallback((data: PeopleForm) => {
        mutateAsync(data).then(() => {
            router.refresh();
            setOpen(false);
        });
    }, []);

    return (<Dialog
        open={open}
        onOpenChange={setOpen}
        title="Creación de Licencia"
        footer={isLoading ? null : <Button
            type="submit" form="people-form"
            className="bg-secondary text-white rounded-3xl animate-fade-right animate-once animate-duration-500 animate-delay-100 animate-ease-in">Crear</Button>}
        trigger={<Button
            className="bg-secondary text-white rounded-3xl animate-fade-left animate-once animate-duration-500 animate-delay-100 animate-ease-in">Crear</Button>}>
        {isLoading ? <div className="flex flex-col gap-4 justify-center items-center py-4">
            <Loader/>
            <p className="text-sm">Creando una nueva licencia</p>
        </div> : <Form
            initialValues={{
                name: undefined, color: undefined
            }}
            onSubmit={onSubmit}
        >
            {(formProps) => <MainForm {...formProps} />}
        </Form>}
    </Dialog>)
}

export function EditPeople({id}: { id: number }) {
    const [open, setOpen] = useState(false);
    const {mutateAsync, isLoading} = useUpdateMutation();
    const {data} = useGetPeopleById(id);
    const router = useRouter();

    const onSubmit = useCallback((data: PeopleForm) => {
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
        title="Creación de Licencia"
        footer={isLoading ? null : <Button
            type="submit" form="people-form"
            className="bg-secondary text-white rounded-3xl animate-fade-right animate-once animate-duration-500 animate-delay-100 animate-ease-in">Editar</Button>}
        trigger={<Button variant="outline"><EditIcon/></Button>}>
        {isLoading ? <div className="flex flex-col gap-4 justify-center items-center py-4">
            <Loader/>
            <p className="text-sm">Creando una nueva licencia</p>
        </div> : <Form
            initialValues={initialValues}
            onSubmit={onSubmit}
        >
            {(formProps) => <MainForm {...formProps} />}
        </Form>}
    </Dialog>)
}

export function CreatePeopleWrapper() {
    const queryClient = new QueryClient({
        queryCache: new QueryCache({
            onError: error => {
                console.error('Error:', error)
            }
        })
    });

    return <QueryClientProvider client={queryClient}>
        <CreatePeople/>
    </QueryClientProvider>
}

export function EditPeopleWrapper({id}: { id: number }) {
    const queryClient = new QueryClient({
        queryCache: new QueryCache({
            onError: error => {
                console.error('Error:', error)
            }
        })
    });

    return <QueryClientProvider client={queryClient}>
        <EditPeople id={id}/>
    </QueryClientProvider>
}