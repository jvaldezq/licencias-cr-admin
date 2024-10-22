'use client';

import {Field, FormRenderProps, SupportedInputs} from "react-final-form";
import {FormInput} from "@/components/Forms/Input/FormInput";
import {FormSwitch} from "@/components/Forms/Switch/FormSwitch";
import * as React from "react";
import {
    useGetAssetsByList, useGetEventTypesList, useGetInstructorList, useGetLicenseList, useGetLocationList,
} from "@/app/events/services/client";
import {FormDropdown} from "@/components/Forms/Dropdown/FormDropdown";
import {IEventForm} from "@/lib/definitions";
import {FormCalendar} from "@/components/Forms/Calendar/FormCalendar";
import dayjs from "dayjs";
import {CloseCircleIcon} from "@/assets/icons/CloseCircleIcon";


export interface EventFormProps extends FormRenderProps<IEventForm> {
}

export const EventForm = (props: EventFormProps) => {
    const {values, handleSubmit, form, errors} = props;
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
    const showTypeInfo = values?.customer?.name && values?.customer?.identification && values?.customer?.phone;
    const showPriceInfo = showTypeInfo && values.locationId && values.licenseTypeId && values.date && values.startTime;

    return <form id="event-form" onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6 py-4" noValidate>
        <Field
            name="typeId"
            component={FormDropdown as unknown as SupportedInputs}
            placeholder='Tipo de cita'
            label='Tipo de cita'
            options={eventTypes || []}
            isLoading={isEventTypesLoading}
        />

        <Field
            component={FormCalendar as unknown as SupportedInputs}
            placeholder={dayjs().format('YYYY MMM DD')}
            label="Fecha"
            name="date"
            wrapperClassName="md:col-span-2"
            // hidden={!showTypeInfo}
        />

        {values?.typeId &&
            <p className="md:col-span-2 border-b border-solid border-primary/[0.2] font-semibold pb-1">Informacion del
                cliente</p>}

        <Field
            name="customer.name"
            component={FormInput as unknown as SupportedInputs}
            placeholder='Cliente nombre'
            label='Cliente nombre'
            autoFocus={true}
            hidden={!values?.typeId}
        />

        <Field
            name="customer.phone"
            component={FormInput as unknown as SupportedInputs}
            placeholder='Teléfono'
            label='Teléfono'
            mask='0000-0000'
            hidden={!values?.typeId}
        />

        <Field
            name="customer.identification"
            component={FormInput as unknown as SupportedInputs}
            placeholder='Cliente cédula'
            label='Cliente cédula'
            mask='0-0000-0000'
            hidden={!values?.typeId}
        />

        {showTypeInfo &&
            <p className="md:col-span-2 border-b border-solid border-primary/[0.2] font-semibold pb-1">Informacion de
                {isClassType ? " clase" : " prueba"}</p>}

        <Field
            name="locationId"
            component={FormDropdown as unknown as SupportedInputs}
            placeholder='Sede'
            label='Sede'
            options={locations || []}
            isLoading={isLocationsLoading}
            hidden={!showTypeInfo}
        />
        <Field
            name="licenseTypeId"
            component={FormDropdown as unknown as SupportedInputs}
            placeholder='Tipo licencia'
            label='Tipo licencia'
            options={licenses || []}
            isLoading={isLicensesLoading}
            hidden={!showTypeInfo}
        />
        <Field
            component={FormCalendar as unknown as SupportedInputs}
            placeholder={dayjs().format('YYYY MMM DD')}
            label="Fecha"
            name="date"
            wrapperClassName="md:col-span-2"
            hidden={!showTypeInfo}
        />
        <Field
            name="startTime"
            component={FormInput as unknown as SupportedInputs}
            type="time"
            placeholder={isClassType ? 'Hora de inicio' : 'Hora de prueba'}
            label={isClassType ? 'Hora de inicio' : 'Hora de prueba'}
            wrapperClassName={isClassType ? '' : 'md:col-span-2'}
            hidden={!showTypeInfo}
        />

        <Field
            name="endTime"
            component={FormInput as unknown as SupportedInputs}
            type="time"
            placeholder='Hora de finalización'
            label='Hora de finalización'
            hidden={!isClassType || !showTypeInfo}
        />

        <Field
            name="instructorId"
            component={FormDropdown as unknown as SupportedInputs}
            placeholder='Instructor'
            label='Instructor'
            options={instructors || []}
            isLoading={isInstructorsLoading}
            disabled={!instructors}
            hidden={!showTypeInfo}
            secondaryAction={values.instructorId ? <CloseCircleIcon className="hover:[&>path]:fill-secondary" onClick={(event) => {
                event.preventDefault();
                form.mutators.clearFieldValue('instructorId');
            }} /> : undefined}
        />

        <Field
            name="assetId"
            component={FormDropdown as unknown as SupportedInputs}
            placeholder='Vehículo'
            label='Vehículo'
            options={assets || []}
            isLoading={isAssetsLoading}
            disabled={!assets}
            hidden={!showTypeInfo}
            secondaryAction={values.assetId ? <CloseCircleIcon className="hover:[&>path]:fill-secondary" onClick={(event) => {
                event.preventDefault();
                form.mutators.clearFieldValue('assetId');
            }} /> : undefined}
        />


        {!isClassType && showTypeInfo &&
            <p className="md:col-span-2 border-b border-solid border-primary/[0.2] font-semibold pb-1">Citar
                cliente</p>}

        <Field
            name="customer.schedule.startTime"
            component={FormInput as unknown as SupportedInputs}
            type="time"
            placeholder="Hora de citar cliente"
            label="Hora de citar cliente"
            hidden={!(!isClassType && showTypeInfo)}
        />

        {showPriceInfo &&
            <p className="md:col-span-2 border-b border-solid border-primary/[0.2] font-semibold pb-1">Informacion de
                precio</p>}

        <Field
            name="payment.price"
            component={FormInput as unknown as SupportedInputs}
            placeholder='Precio'
            label='Precio'
            hidden={!showPriceInfo}
        />
        <Field
            name="payment.cashAdvance"
            component={FormInput as unknown as SupportedInputs}
            placeholder='Adelanto'
            label='Adelanto'
            hidden={values?.payment?.paid || !showPriceInfo}
        />
        <Field
            name="payment.paid"
            component={FormSwitch as unknown as SupportedInputs}
            placeholder='Pagó total'
            label='Pagó total'
            hidden={!showPriceInfo}
        />
    </form>
}