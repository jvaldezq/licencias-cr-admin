'use client';

import {Field, FormRenderProps, SupportedInputs} from "react-final-form";
import {FormInput} from "@/components/Forms/Input/FormInput";
import * as React from "react";
import {
    useGetLicenseList,
    useGetLocationList,
} from "@/app/assets/services/client";
import {FormSwitch} from "@/components/Forms/Switch/FormSwitch";
import {FormDropdown} from "@/components/Forms/Dropdown/FormDropdown";

export interface AssetFormProps {
    name: string;
    plate: string;
    status: boolean;
    locationId: number;
}

export interface FormProps extends FormRenderProps<AssetFormProps> {
}

export const AssetForm = (props: FormProps) => {
    const {handleSubmit} = props;
    const {data, isLoading} = useGetLocationList();
    const {data: licenses, isLoading: isLicensesLoading} = useGetLicenseList();

    return <form id="asset-form" onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6 py-4">
        <Field
            name="name"
            component={FormInput as unknown as SupportedInputs}
            placeholder='Nombre'
            label='Nombre'
            autoFocus={true}
            validate={value => (value ? undefined : 'Requerido')}
        />
        <Field
            name="plate"
            component={FormInput as unknown as SupportedInputs}
            placeholder='Placa'
            label='Placa'
            validate={value => (value ? undefined : 'Requerido')}
        />
        <Field
            name="locationId"
            component={FormDropdown as unknown as SupportedInputs}
            placeholder='Sede'
            label='Sede'
            options={data || []}
            isLoading={isLoading}
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
            name="status"
            component={FormSwitch as unknown as SupportedInputs}
            placeholder='Activo'
            label='Activo'
        />
    </form>
}