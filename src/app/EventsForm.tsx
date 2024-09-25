'use client';

import {useCallback, useState} from "react";
import {Field, Form, FormRenderProps, SupportedInputs} from "react-final-form";
import {FormInput} from "@/components/Forms/Input/FormInput";
import {FormSwitch} from "@/components/Forms/Switch/FormSwitch";
import {Button} from "@/components/ui/button";
import {Dialog} from "@/components/Dialog";
import * as React from "react";
import {QueryCache, QueryClient, QueryClientProvider} from "react-query";
import {
    useCreateMutation,
    useGetInstructorListByLocationId,
    useGetLocationList,
} from "@/app/clientService";
import {useRouter} from "next/navigation";
import {Loader} from "@/components/Loader";
import {FormDropdown} from "@/components/Forms/Dropdown/FormDropdown";

export interface EventForm {
    customerName: string;
    customerId: string;
    phone: string;
    price?: number;
    cashAdvance?: number;
    date: Date;
    endDate: Date;
    customerPass?: boolean;
    paid?: boolean;
    customerPaidDate?: Date;
    status?: string;
    locationId: number;
    instructorId?: number;
    createdById?: number;
}

export interface FormProps extends FormRenderProps<EventForm> {
}

const MainForm = (props: FormProps) => {
    const {data: locations, isLoading: isLocationsLoading} = useGetLocationList();
    const {data: instructors, isLoading: isInstructorsLoading} = useGetInstructorListByLocationId(props.values.locationId);

    const {handleSubmit} = props;

    console.log('hello', props);

    return <form id="event-form" onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6 py-4">
        <Field
            name="customerName"
            component={FormInput as unknown as SupportedInputs}
            placeholder='Cliente nombre'
            label='Cliente nombre'
            autoFocus={true}
            validate={value => (value ? undefined : 'Requerido')}
        />
        <Field
            name="phone"
            component={FormInput as unknown as SupportedInputs}
            placeholder='Teléfono'
            label='Teléfono'
            autoFocus={true}
            validate={value => (value ? undefined : 'Requerido')}
        />
        <Field
            name="customerId"
            component={FormInput as unknown as SupportedInputs}
            placeholder='Cliente cédula'
            label='Cliente cédula'
            autoFocus={true}
            validate={value => (value ? undefined : 'Requerido')}
        />
        <Field
            name="price"
            component={FormInput as unknown as SupportedInputs}
            placeholder='Precio'
            label='Precio'
            autoFocus={true}
            validate={value => (value ? undefined : 'Requerido')}
        />
        <Field
            name="date"
            component={FormInput as unknown as SupportedInputs}
            placeholder='Fecha y hora'
            label='Fecha y hora'
            autoFocus={true}
            validate={value => (value ? undefined : 'Requerido')}
        />
        <Field
            name="locationId"
            component={FormDropdown as unknown as SupportedInputs}
            placeholder='Sede'
            label='Sede'
            options={locations || []}
            isLoading={isLocationsLoading}
        />
        <Field
            name="instructorId"
            component={FormDropdown as unknown as SupportedInputs}
            placeholder='Instructor'
            label='Instructor'
            options={instructors || []}
            isLoading={isInstructorsLoading}
            disabled={!instructors}
        />
        <Field
            name="paid"
            component={FormSwitch as unknown as SupportedInputs}
            placeholder='Pagó'
            label='Pagó'
        />
    </form>
}

export function CreateEvent() {
    const [open, setOpen] = useState(false);
    const {mutateAsync, isLoading} = useCreateMutation();
    const router = useRouter();

    const onSubmit = useCallback((data: EventForm) => {
        mutateAsync(data).then(() => {
            router.refresh();
            setOpen(false);
        });
    }, []);

    return (<Dialog
        open={open}
        onOpenChange={setOpen}
        title="Creación de Evento"
        footer={isLoading ? null : <Button
            type="submit" form="event-form"
            className="bg-secondary text-white rounded-3xl animate-fade-right animate-once animate-duration-500 animate-delay-100 animate-ease-in">Crear</Button>}
        trigger={<Button
            className="bg-secondary text-white rounded-3xl animate-fade-left animate-once animate-duration-500 animate-delay-100 animate-ease-in">Crear</Button>}>
        {isLoading ? <div className="flex flex-col gap-4 justify-center items-center py-4">
            <Loader/>
            <p className="text-sm">Creando una nueva Evento</p>
        </div> : <Form
            initialValues={{
                customerName: undefined,
                customerId: undefined,
                phone: undefined,
                price: undefined,
                cashAdvance: undefined,
                date: undefined,
                endDate: undefined,
                customerPass: undefined,
                paid: undefined,
                customerPaidDate: undefined,
                status: undefined,
                locationId: undefined,
                instructorId: undefined,
                createdById: undefined,
            }}
            onSubmit={onSubmit}
        >
            {(formProps) => <MainForm {...formProps} />}
        </Form>}
    </Dialog>)
}

export function CreateEventWrapper() {
    const queryClient = new QueryClient({
        queryCache: new QueryCache({
            onError: error => {
                console.error('Error:', error)
            }
        })
    });

    return <QueryClientProvider client={queryClient}>
        <CreateEvent/>
    </QueryClientProvider>
}