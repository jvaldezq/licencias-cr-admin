'use client';

import {Field, FormRenderProps, SupportedInputs} from "react-final-form";
import {FormInput} from "@/components/Forms/Input/FormInput";
import {FormSwitch} from "@/components/Forms/Switch/FormSwitch";
import * as React from "react";

export interface LocationFormProps {
    name: string;
    status: boolean;
}

export type FormProps = FormRenderProps<LocationFormProps>

export const LocationForm = (props: FormProps) => {
    const {handleSubmit} = props;

    return <form id="location-form" onSubmit={handleSubmit} className="flex flex-col gap-6 py-4">
        <Field
            name="name"
            component={FormInput as unknown as SupportedInputs}
            placeholder='Nombre'
            label='Nombre'
            autoFocus={true}
        />
        <Field
            name="status"
            component={FormSwitch as unknown as SupportedInputs}
            placeholder='Activo'
            label='Activo'
        />
    </form>
}