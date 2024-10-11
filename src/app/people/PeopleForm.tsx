'use client';

import {useCallback, useState} from "react";
import {Field, Form, FormRenderProps, SupportedInputs} from "react-final-form";
import {FormInput} from "@/components/Forms/Input/FormInput";
import {Button} from "@/components/ui/button";
import {Dialog} from "@/components/Dialog";
import * as React from "react";
import {QueryCache, QueryClient, QueryClientProvider} from "react-query";
import { useGetPeopleById, useUpdateMutation} from "@/app/people/clientService";
import {useRouter} from "next/navigation";
import {Loader} from "@/components/Loader";
import {EditIcon} from "@/assets/icons/EditIcon";
import {FormDropdown} from "@/components/Forms/Dropdown/FormDropdown";
import {useGetLocationList} from "@/app/events/services/client";
import {FormSwitch} from "@/components/Forms/Switch/FormSwitch";

export interface PeopleForm {
    id: number;
    name: string;
    location: {
        id: number;
    };
    access: {
        instructor: boolean; receptionist: boolean;
    };
}

export interface FormProps extends FormRenderProps<PeopleForm> {
}

const MainForm = (props: FormProps) => {
    const {handleSubmit} = props;
    const {data: locations, isLoading: isLocationsLoading} = useGetLocationList();

    return <form id="people-form" onSubmit={handleSubmit} className="flex flex-col gap-6 py-4">
        <Field
            name="name"
            component={FormInput as unknown as SupportedInputs}
            placeholder='Nombre'
            label='Nombre'
            validate={value => (value ? undefined : 'Requerido')}
            disabled={true}
        />
        <Field
            name="location.id"
            component={FormDropdown as unknown as SupportedInputs}
            placeholder='Sede'
            label='Sede'
            options={locations || []}
            isLoading={isLocationsLoading}
            autoFocus={true}
            validate={value => (value ? undefined : 'Requerido')}
        />
        <Field
            name="access.instructor"
            component={FormSwitch as unknown as SupportedInputs}
            placeholder='Instructor'
            label='Instructor'
        />
        <Field
            name="access.receptionist"
            component={FormSwitch as unknown as SupportedInputs}
            placeholder='Recepcionista'
            label='Recepcionista'
        />
    </form>
}

export function EditPeople({id}: { id: number }) {
    const [open, setOpen] = useState(false);
    const {mutateAsync, isLoading} = useUpdateMutation();
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
            className="bg-secondary text-white rounded-3xl animate-fade-right animate-once animate-duration-500 animate-delay-100 animate-ease-in">Editar</Button>}
        trigger={<Button variant="outline"><EditIcon/></Button>}>
        {isLoading ? <div className="flex flex-col gap-4 justify-center items-center py-4">
            <Loader/>
            <p className="text-sm">Creando una nueva licencia</p>
        </div> : <PeopleForm onSubmit={onSubmit} id={id}/>}
    </Dialog>)
}

function PeopleForm({id, onSubmit}: { id: number, onSubmit: (data: PeopleForm) => void }) {
    const {data, isLoading} = useGetPeopleById(id);
    if (isLoading) {
        return <div className="flex flex-col gap-4 justify-center items-center py-4"><Loader/></div>
    }
    return <Form
        initialValues={data}
        onSubmit={onSubmit}
    >
        {(formProps) => <MainForm {...formProps} />}
    </Form>
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