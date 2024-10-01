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
    useCreateMutation, useGetEventTypesList, useGetInstructorListByLocationId, useGetLicenseList, useGetLocationList,
} from "@/app/events/clientService";
import {useRouter} from "next/navigation";
import {Loader} from "@/components/Loader";
import {FormDropdown} from "@/components/Forms/Dropdown/FormDropdown";
import {IEventForm} from "@/lib/definitions";


export interface FormProps extends FormRenderProps<IEventForm> {
}

const MainForm = (props: FormProps) => {
    const {values} = props;
    const {data: locations, isLoading: isLocationsLoading} = useGetLocationList();
    const {data: eventTypes, isLoading: isEventTypesLoading} = useGetEventTypesList();
    const {data: licenses, isLoading: isLicensesLoading} = useGetLicenseList();
    const {
        data: instructors, isLoading: isInstructorsLoading
    } = useGetInstructorListByLocationId(props.values.locationId);
    const {handleSubmit} = props;

    const isClassType = eventTypes?.find(t => t.id === +values?.type)?.name.includes('Clase');

    return <form id="event-form" onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6 py-4">
        <Field
            name="type"
            component={FormDropdown as unknown as SupportedInputs}
            placeholder='Tipo de cita'
            label='Tipo de cita'
            options={eventTypes || []}
            isLoading={isEventTypesLoading}
            validate={value => (value ? undefined : 'Requerido')}
        />
        {values?.type && <>
            <p className="col-span-2 border-b border-solid border-primary/[0.2] font-semibold pb-1">Informacion del
                cliente</p>
            <Field
                name="customer.name"
                component={FormInput as unknown as SupportedInputs}
                placeholder='Cliente nombre'
                label='Cliente nombre'
                autoFocus={true}
                validate={value => (value ? undefined : 'Requerido')}
            />
            <Field
                name="customer.phone"
                component={FormInput as unknown as SupportedInputs}
                placeholder='Teléfono'
                label='Teléfono'
                validate={value => (value ? undefined : 'Requerido')}
            />
            <Field
                name="customer.identification"
                component={FormInput as unknown as SupportedInputs}
                placeholder='Cliente cédula'
                label='Cliente cédula'
                validate={value => (value ? undefined : 'Requerido')}
            />
            {(values?.customer?.name && values?.customer?.identification && values?.customer?.phone) && <>
                <p className="col-span-2 border-b border-solid border-primary/[0.2] font-semibold pb-1">Informacion de
                    cita</p>
                <Field
                    name="locationId"
                    component={FormDropdown as unknown as SupportedInputs}
                    placeholder='Sede'
                    label='Sede'
                    options={locations || []}
                    isLoading={isLocationsLoading}
                    validate={value => (value ? undefined : 'Requerido')}
                />
                <Field
                    name="licenseTypeId"
                    component={FormDropdown as unknown as SupportedInputs}
                    placeholder='Tipo licencia'
                    label='Tipo licencia'
                    options={licenses || []}
                    isLoading={isLicensesLoading}
                    validate={value => (value ? undefined : 'Requerido')}
                />
                <Field
                    name="schedule.eventStartDate"
                    component={FormInput as unknown as SupportedInputs}
                    type="datetime-local"
                    placeholder='Fecha y hora'
                    label='Fecha y hora'
                    validate={value => (value ? undefined : 'Requerido')}
                    wrapperClassName="col-span-2"
                />
                {isClassType && <Field
                    name="schedule.eventEndDate"
                    component={FormInput as unknown as SupportedInputs}
                    type="time"
                    placeholder='Hora de finalización'
                    label='Hora de finalización'
                    validate={value => (value ? undefined : 'Requerido')}
                    wrapperClassName="col-span-2"
                />}

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
                    name="assetId"
                    component={FormDropdown as unknown as SupportedInputs}
                    placeholder='Vehículo'
                    label='Vehículo'
                    options={instructors || []}
                    isLoading={isInstructorsLoading}
                    disabled={!instructors}
                />
            </>}
            {(values?.licenseTypeId && values?.schedule?.eventStartDate) && <>
                <p className="col-span-2 border-b border-solid border-primary/[0.2] font-semibold pb-1">Informacion de
                    precio</p>
                <Field
                    name="payment.price"
                    component={FormInput as unknown as SupportedInputs}
                    placeholder='Precio'
                    label='Precio'
                />
                <Field
                    name="payment.paid"
                    component={FormSwitch as unknown as SupportedInputs}
                    placeholder='Pagó total'
                    label='Pagó total'
                />
                {!values?.payment?.paid && <Field
                    name="payment.cashAdvance"
                    component={FormInput as unknown as SupportedInputs}
                    placeholder='Adelanto'
                    label='Adelanto'
                />}
            </>}
        </>}
    </form>
}

export function CreateEvent() {
    const [open, setOpen] = useState(false);
    const {mutateAsync, isLoading} = useCreateMutation();
    const router = useRouter();

    const onSubmit = useCallback((data: IEventForm) => {
        console.log(data);
        // mutateAsync(data).then(() => {
        //     router.refresh();
        //     setOpen(false);
        // });
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
            <p className="text-sm">Creando una nueva Cita</p>
        </div> : <Form
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