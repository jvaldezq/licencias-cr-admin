'use client';

import {Field, FormRenderProps, SupportedInputs} from "react-final-form";
import {FormInput} from "@/components/Forms/Input/FormInput";
import {FormSwitch} from "@/components/Forms/Switch/FormSwitch";
import * as React from "react";
import {
    useGetAssetsByList, useGetEventTypesList, useGetInstructorList, useGetLicenseList, useGetLocationList,
} from "@/app/events/services/client";
import {FormDropdown} from "@/components/Forms/Dropdown/FormDropdown";
import {CLASS_TYPE, IEventForm, OWNCAR} from "@/lib/definitions";
import {FormCalendar} from "@/components/Forms/Calendar/FormCalendar";
import dayjs from "dayjs";
import {CloseCircleIcon} from "@/assets/icons/CloseCircleIcon";
import {FormTextarea} from "@/components/Forms/Textarea/FormTextarea";

export type EventFormProps = FormRenderProps<IEventForm>

export const EventForm = (props: EventFormProps) => {
    const {values, handleSubmit, form} = props;
    const {data: locations, isLoading: isLocationsLoading} = useGetLocationList();
    const {data: eventTypes, isLoading: isEventTypesLoading} = useGetEventTypesList();
    const {data: licenses, isLoading: isLicensesLoading} = useGetLicenseList();
    const {data: assets, isLoading: isAssetsLoading} = useGetAssetsByList({
        licenseTypeId: values?.licenseTypeId, locationId: values?.locationId
    })
    const {
        data: instructors, isLoading: isInstructorsLoading
    } = useGetInstructorList();

    const isClassType = values.typeId === CLASS_TYPE.CLASS;
    const showTypeInfo = values?.customer?.name && values?.customer?.identification && values?.customer?.phone;
    const showPriceInfo = showTypeInfo && values.locationId && values.licenseTypeId && values.date && values.startTime;
    const assetsList = [{ id: OWNCAR.OWN, name: "Propio" }, ...assets || []];

    return <form id="event-form" onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6 py-4">
        <Field
            name="typeId"
            component={FormDropdown as unknown as SupportedInputs}
            placeholder='Tipo de cita'
            label='Tipo de cita'
            options={eventTypes || []}
            isLoading={isEventTypesLoading}
            validate={(value) => value !== undefined ? undefined : 'El tipo de cita es requerido'}
        />

        {values?.typeId &&
            <p className="md:col-span-2 border-b border-solid border-primary/[0.2] font-semibold pb-1">Información del
                cliente</p>}

        <Field
            name="customer.name"
            component={FormInput as unknown as SupportedInputs}
            placeholder='Cliente nombre'
            label='Cliente nombre'
            autoFocus={true}
            hidden={!values?.typeId}
            validate={(value) => value !== undefined ? undefined : 'El nombre es requerido'}
        />

        <Field
            name="customer.phone"
            component={FormInput as unknown as SupportedInputs}
            placeholder='Teléfono'
            label='Teléfono'
            mask='0000-0000'
            hidden={!values?.typeId}
            validate={(value) => value !== undefined ? undefined : 'El teléfono es requerido'}
        />

        <Field
            name="customer.identification"
            component={FormInput as unknown as SupportedInputs}
            placeholder='Cliente cédula'
            label='Cliente cédula'
            mask={Number}
            hidden={!values?.typeId}
            validate={(value) => value !== undefined ? undefined : 'La cédula es requerida'}
        />

        {showTypeInfo &&
            <p className="md:col-span-2 border-b border-solid border-primary/[0.2] font-semibold pb-1">Información de
                {isClassType ? " clase" : " prueba"}</p>}

        <Field
            name="locationId"
            component={FormDropdown as unknown as SupportedInputs}
            placeholder='Sede'
            label='Sede'
            options={locations || []}
            isLoading={isLocationsLoading}
            hidden={!showTypeInfo}
            validate={(value) => value !== undefined ? undefined : 'La sede es requerida'}
        />
        <Field
            name="licenseTypeId"
            component={FormDropdown as unknown as SupportedInputs}
            placeholder='Tipo licencia'
            label='Tipo licencia'
            options={licenses || []}
            isLoading={isLicensesLoading}
            hidden={!showTypeInfo}
            validate={(value) => value !== undefined ? undefined : 'El tipo de licencia es requerido'}
        />
        <Field
            component={FormCalendar as unknown as SupportedInputs}
            placeholder={dayjs().format('YYYY MMM DD')}
            label="Fecha"
            name="date"
            wrapperClassName="md:col-span-2"
            hidden={!showTypeInfo}
            validate={(value) => value !== undefined ? undefined : 'La fecha es requerida'}
        />
        <Field
            name="startTime"
            component={FormInput as unknown as SupportedInputs}
            type="time"
            placeholder={isClassType ? 'Hora de inicio' : 'Hora de prueba'}
            label={isClassType ? 'Hora de inicio' : 'Hora de prueba'}
            wrapperClassName={isClassType ? '' : 'md:col-span-2'}
            hidden={!showTypeInfo}
            validate={(value) => value !== undefined ? undefined : 'La hora de inicio es requerida'}
        />

        <Field
            name="endTime"
            component={FormInput as unknown as SupportedInputs}
            type="time"
            placeholder='Hora de finalización'
            label='Hora de finalización'
            hidden={!isClassType || !showTypeInfo}
            validate={(value) => value !== undefined ? undefined : !isClassType ? undefined : 'La hora de finalización es requerida'}
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
            options={assetsList}
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
            validate={(value) => value !== undefined ? undefined : isClassType ? undefined : 'La hora de inicio es requerida'}
        />

        {showPriceInfo &&
            <p className="md:col-span-2 border-b border-solid border-primary/[0.2] font-semibold pb-1">Información de
                precio</p>}

        <Field
            name="payment.price"
            component={FormInput as unknown as SupportedInputs}
            placeholder='Precio'
            label='Precio'
            hidden={!showPriceInfo}
            validate={(value) => value !== undefined ? undefined : 'El precio es requerido'}
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

        {showPriceInfo &&
            <p className="md:col-span-2 border-b border-solid border-primary/[0.2] font-semibold pb-1">Información extra</p>}

        <Field
            name="payment.isReferred"
            component={FormSwitch as unknown as SupportedInputs}
            placeholder='Es referido'
            label='Es referido'
            hidden={!showPriceInfo}
            wrapperClassName="md:col-span-2"
        />

        <Field
            name="customer.notes"
            component={FormTextarea as unknown as SupportedInputs}
            type=""
            placeholder="Comentarios"
            label="Comentarios"
            hidden={!showPriceInfo}
            wrapperClassName="md:col-span-2"
        />
    </form>
}