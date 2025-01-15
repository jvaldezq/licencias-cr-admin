'use client';

import {Field, FormRenderProps, SupportedInputs} from "react-final-form";
import {FormInput} from "@/components/Forms/Input/FormInput";
import * as React from "react";
import {FormSwitch} from "@/components/Forms/Switch/FormSwitch";
import {FieldArray} from "react-final-form-arrays";

export interface SchoolFormProps {
    name: string;
    status: boolean;
    schoolPrices: {
        licenseTypeId: string;
        internalPrice: string;
        externalPrice: string;
    }[];
}

export type FormProps = FormRenderProps<SchoolFormProps>

export const SchoolForm = (props: FormProps) => {
    const {handleSubmit} = props;

    return <form id="school-form" onSubmit={handleSubmit} className="grid md:grid-cols-1 gap-6 py-4">
        <Field
            name="name"
            component={FormInput as unknown as SupportedInputs}
            placeholder='Nombre'
            label='Nombre'
            autoFocus={true}
            validate={(value) => value !== undefined ? undefined : 'El nombre es requerido'}
        />
        <Field
            name="status"
            component={FormSwitch as unknown as SupportedInputs}
            placeholder='Activo'
            label='Activo'
        />

        <FieldArray name="schoolPrices">
            {({ fields }) => (
                <>
                    {fields.map((name, index) => (
                        <div key={index} className="grid grid-cols-2 gap-4 border-t border-solid border-primary/[0.2] py-2">
                            <p className="text-primary/[0.7] text-sm col-span-full">{fields.value[index].name}</p>
                            <Field
                                name={`${name}.internalPrice`}
                                component={FormInput as unknown as SupportedInputs}
                                placeholder="Precio interno"
                                label="Precio interno"
                                autoFocus={false}
                            />
                            <Field
                                name={`${name}.externalPrice`}
                                component={FormInput as unknown as SupportedInputs}
                                placeholder="Precio externo"
                                label="Precio externo"
                                autoFocus={false}
                            />
                        </div>
                    ))}
                </>
            )}
        </FieldArray>
    </form>
}