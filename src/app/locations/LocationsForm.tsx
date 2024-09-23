'use client';

import {useCallback} from "react";
import {ValidationErrors} from "final-form";
import {Field, Form, FormRenderProps, SupportedInputs} from "react-final-form";
import {Dropdown} from "@/components/Forms/Dropdown/Dropdown";

export interface LocationForm {
    name: string;
    status: boolean;
}

export interface FormProps extends FormRenderProps<LocationForm> {
}

const MainForm = (props: FormProps) => {
    const {handleSubmit} = props;
    // const {data, isLoading} = useGetMakes();

    return <form id="car-entry" onSubmit={handleSubmit} className="tw-flex tw-flex-col tw-gap-4">
        <Field
            name="makeId"
            component={Dropdown as unknown as SupportedInputs}
            placeholder='Marca'
            label='Marca'
            // loading={isLoading}
            autoFocus={true}
            // options={data}
        />
    </form>
}

export const LocationsForm = () => {
    const onSubmit = useCallback((data: LocationForm) => {
        console.log('HELLO MOTO', data)
    }, []);

    const validate = useCallback(async (data: LocationForm) => {
        console.log('HELLO MOTO', data)
        const errors: Partial<LocationForm> = {};
        return errors as ValidationErrors;
    }, []);

    return (<Form
        initialValues={{
            name: '', status: false
        }}
        onSubmit={onSubmit}
        validate={validate}
        validateOnBlur={true}
    >
        {(formProps) => <MainForm {...formProps} />}
    </Form>);
}