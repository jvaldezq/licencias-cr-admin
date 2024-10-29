'use client';

import {Field, FormRenderProps, SupportedInputs} from "react-final-form";
import {FormInput} from "@/components/Forms/Input/FormInput";
import * as React from "react";

export interface LicenseFormProps {
    name: string;
    color: string;
}

export type FormProps = FormRenderProps<LicenseFormProps>

export const LicenseForm = (props: FormProps) => {
    const {handleSubmit} = props;

    return <form id="license-form" onSubmit={handleSubmit} className="flex flex-col gap-6 py-4">
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