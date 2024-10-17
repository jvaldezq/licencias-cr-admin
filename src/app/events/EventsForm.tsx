'use client';

import {useCallback, useMemo, useState} from "react";
import {Field, Form, FormRenderProps, SupportedInputs} from "react-final-form";
import {FormInput} from "@/components/Forms/Input/FormInput";
import {FormSwitch} from "@/components/Forms/Switch/FormSwitch";
import {Button} from "@/components/ui/button";
import {Dialog} from "@/components/Dialog";
import * as React from "react";
import {QueryCache, QueryClient, QueryClientProvider} from "react-query";
import {
    useCreateMutation,
    useGetAssetsByList,
    useGetEventById,
    useGetEventTypesList,
    useGetInstructorList,
    useGetLicenseList,
    useGetLocationList,
    useUpdateMutation,
} from "@/app/events/services/client";
import {useRouter} from "next/navigation";
import {Loader} from "@/components/Loader";
import {FormDropdown} from "@/components/Forms/Dropdown/FormDropdown";
import {IEventForm, IUser} from "@/lib/definitions";
import {FormCalendar} from "@/components/Forms/Calendar/FormCalendar";
import dayjs from "dayjs";
import {EditIcon} from "@/assets/icons/EditIcon";

export interface FormProps extends FormRenderProps<IEventForm> {
}

const MainForm = (props: FormProps) => {
    const {values, handleSubmit} = props;
    const {data: locations, isLoading: isLocationsLoading} = useGetLocationList();
    const {data: eventTypes, isLoading: isEventTypesLoading} = useGetEventTypesList();
    const {data: licenses, isLoading: isLicensesLoading} = useGetLicenseList();
    const {data: assets, isLoading: isAssetsLoading} = useGetAssetsByList({
        licenseTypeId: values?.licenseTypeId, locationId: values?.locationId
    })
    const {
        data: instructors, isLoading: isInstructorsLoading
    } = useGetInstructorList();

    const isClassType = values.typeId === 1;

    return <form id="event-form" onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6 py-4">
        <Field
            name="typeId"
            component={FormDropdown as unknown as SupportedInputs}
            placeholder='Tipo de cita'
            label='Tipo de cita'
            options={eventTypes || []}
            isLoading={isEventTypesLoading}
            validate={value => (value ? undefined : 'Requerido')}
        />
        {values?.typeId && <>
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
        </>}

        {(values?.customer?.name && values?.customer?.identification && values?.customer?.phone) && <>
            <p className="col-span-2 border-b border-solid border-primary/[0.2] font-semibold pb-1">Informacion de
                {isClassType ? " clase" : " prueba"}</p>
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
                component={FormCalendar as unknown as SupportedInputs}
                placeholder={dayjs().format('YYYY MMM DD')}
                label="Fecha"
                name="date"
                validate={value => (value ? undefined : 'Requerido')}
                wrapperClassName="col-span-2"
            />
            <Field
                name="startTime"
                component={FormInput as unknown as SupportedInputs}
                type="time"
                placeholder={isClassType ? 'Hora de inicio' : 'Hora de prueba'}
                label={isClassType ? 'Hora de inicio' : 'Hora de prueba'}
                step={900}
                validate={value => (value ? undefined : 'Requerido')}
                wrapperClassName={isClassType ? '' : 'col-span-2'}
            />

            {isClassType && <>
                <Field
                    name="endTime"
                    component={FormInput as unknown as SupportedInputs}
                    type="time"
                    placeholder='Hora de finalización'
                    label='Hora de finalización'
                    step={900}
                    validate={value => (value ? undefined : 'Requerido')}
                />
            </>}

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
                options={assets || []}
                isLoading={isAssetsLoading}
                disabled={!assets}
            />
        </>}

        {!isClassType && values.locationId && values.licenseTypeId && values.date && values.startTime && <>
            <p className="col-span-2 border-b border-solid border-primary/[0.2] font-semibold pb-1">Citar cliente</p>
            <Field
                name="customer.schedule.startTime"
                component={FormInput as unknown as SupportedInputs}
                type="time"
                placeholder="Hora de citar cliente"
                label="Hora de citar cliente"
                step="900"
                validate={value => (value ? undefined : 'Requerido')}
            />
        </>}

        {(values?.customer?.name && values?.customer?.identification && values?.customer?.phone && values.locationId && values.licenseTypeId && values.date && values.startTime) && <>
            <p className="col-span-2 border-b border-solid border-primary/[0.2] font-semibold pb-1">Informacion de
                precio</p>
            <Field
                name="payment.price"
                component={FormInput as unknown as SupportedInputs}
                placeholder='Precio'
                label='Precio'
                validate={value => (value ? undefined : 'Requerido')}
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
    </form>
}

export function CreateEvent({user}: { user: IUser }) {
    const [open, setOpen] = useState(false);
    const {mutateAsync, isLoading} = useCreateMutation();
    const router = useRouter();

    const onSubmit = useCallback((data: IEventForm) => {
        mutateAsync(data).then(() => {
            router.refresh();
            setOpen(false);
        });
    }, [user, mutateAsync, router]);

    const initialValues = {
        typeId: undefined,
        customer: {
            name: undefined, identification: undefined, phone: undefined, schedule: {
                startTime: undefined,
            }
        },
        locationId: undefined,
        licenseTypeId: undefined,
        date: dayjs(),
        startTime: undefined,
        endTime: undefined,
        instructorId: undefined,
        assetId: undefined,
        createdById: user.id,
        payment: {
            price: undefined, cashAdvance: undefined, paid: false,
        }
    }

    return (<Dialog
        open={open}
        onOpenChange={setOpen}
        title="Creación de Evento"
        footer={isLoading && !user?.access?.instructor ? null : <Button
            type="submit" form="event-form"
            className="bg-secondary text-white rounded-3xl animate-fade-right animate-once animate-duration-500 animate-delay-100 animate-ease-in">Crear</Button>}
        trigger={<Button
            className="bg-secondary text-white rounded-3xl animate-fade-left animate-once animate-duration-500 animate-delay-100 animate-ease-in">Crear</Button>}>
        {isLoading ? <div className="flex flex-col gap-4 justify-center items-center py-4">
            <Loader/>
            <p className="text-sm">Creando una nueva Cita</p>
        </div> : <Form
            initialValues={initialValues}
            onSubmit={onSubmit}
        >
            {(formProps) => <MainForm {...formProps} />}
        </Form>}
    </Dialog>)
}

export function EditEvent({id, user}: { id: number, user: IUser }) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    return (<Dialog
        open={open}
        onOpenChange={setOpen}
        title="Edición de Cita"
        footer={isLoading ? null : <Button
            type="submit" form="event-form"
            className="bg-secondary text-white rounded-3xl animate-fade-right animate-once animate-duration-500 animate-delay-100 animate-ease-in">Editar</Button>}
        trigger={<Button variant="outline"><EditIcon/></Button>}>
        <EventForm user={user} id={id} setIsLoading={setIsLoading} setOpen={setOpen}/>
    </Dialog>)
}

interface EventFormProps {
    user: IUser;
    id: number;
    setIsLoading: (value: boolean) => void;
    setOpen: (value: boolean) => void;
}

const EventForm = ({user, id, setIsLoading, setOpen}: EventFormProps) => {
    const {mutateAsync, isLoading: isUpdateLoading} = useUpdateMutation();
    const {data, isLoading} = useGetEventById(id);
    const router = useRouter();

    const onSubmit = useCallback((updatedData: IEventForm) => {
        setIsLoading(true);
        mutateAsync(updatedData).then(() => {
            router.refresh();
            setOpen(false);
            setIsLoading(false);
        });
    }, []);

    const [startTime, endTime] = useMemo(() => {
        if (data?.typeId === 1) {
            const dataStartDate = data?.customer?.schedule.startDate;
            const dataEndDate = data?.customer?.schedule.endDate;
            return [dayjs(dataStartDate).format('HH:mm'), dayjs(dataEndDate).format('HH:mm')];
        } else {
            const dataStartDate = data?.date;
            return [dayjs(dataStartDate).format('HH:mm')];
        }
    }, [data]);

    const initialValues = {
        id: data?.id,
        typeId: data?.typeId,
        customer: {
            name: data?.customer?.name,
            identification: data?.customer?.identification,
            phone: data?.customer?.phone,
            schedule: {
                startTime: dayjs(data?.customer?.schedule.startDate).format('HH:mm'),
            }
        },
        locationId: data?.locationId,
        licenseTypeId: data?.licenseTypeId,
        date: data?.date || dayjs(),
        startTime: startTime,
        endTime: endTime,
        instructorId: data?.instructorId,
        assetId: data?.assetId,
        createdById: user.id,
        payment: {
            price: data?.payment?.price, cashAdvance: data?.payment?.cashAdvance, paid: data?.payment?.paid,
        },
    }

    return <>
        {isLoading ? <div className="flex flex-col gap-4 justify-center items-center py-4">
            <Loader/>
            <p className="text-sm">Cargando cita</p>
        </div> : isUpdateLoading ? <div className="flex flex-col gap-4 justify-center items-center py-4">
            <Loader/>
            <p className="text-sm">Actualizando cita</p>
        </div> : <Form
            initialValues={initialValues}
            onSubmit={onSubmit}
        >
            {(formProps) => <MainForm {...formProps} />}
        </Form>}
    </>
}

export function CreateEventWrapper({user}: { user: IUser }) {
    const queryClient = new QueryClient({
        queryCache: new QueryCache({
            onError: error => {
                console.error('Error:', error)
            }
        })
    });

    return <QueryClientProvider client={queryClient}>
        <CreateEvent user={user}/>
    </QueryClientProvider>
}