'use client';

import {Field, FormRenderProps, SupportedInputs} from "react-final-form";
import {FormInput} from "@/components/Forms/Input/FormInput";
import * as React from "react";
import {FormDropdown} from "@/components/Forms/Dropdown/FormDropdown";
import {useGetLocationList} from "@/app/events/services/client";
import {FormSwitch} from "@/components/Forms/Switch/FormSwitch";

export interface PeopleFormProps {
    id: number;
    name: string;
    location: {
        id: number;
    };
    access: {
        instructor: boolean; receptionist: boolean;
    };
}

interface FormProps extends FormRenderProps<PeopleFormProps> {
}

export const PeopleForm = (props: FormProps) => {
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