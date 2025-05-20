'use client';

import { Field, FormRenderProps, SupportedInputs } from 'react-final-form';
import { FormInput } from '@/components/Forms/Input/FormInput';
import * as React from 'react';
import {
  useGetLocationList,
} from '@/app/prices/services/client';
import { FormDropdown } from '@/components/Forms/Dropdown/FormDropdown';
import { FormTextarea } from '@/components/Forms/Textarea/FormTextarea';

export interface PriceFormProps {
  description: string;
  note: string;
  priceClient: number;
  priceSchool: number;
  locationId: string;
}

export type FormProps = FormRenderProps<PriceFormProps>;

export const PriceForm = (props: FormProps) => {
  const { handleSubmit } = props;
  const { data, isLoading } = useGetLocationList();

  return (
    <form
      id="price-form"
      onSubmit={handleSubmit}
      className="grid md:grid-cols-2 gap-6 py-4"
    >
      <Field
        name="description"
        component={FormInput as unknown as SupportedInputs}
        placeholder="Description"
        label="Description"
        autoFocus={true}
        validate={(value) =>
          value !== undefined ? undefined : 'La description es requerida'
        }
      />
      <Field
        name="priceClient"
        component={FormInput as unknown as SupportedInputs}
        placeholder="Precio cliente"
        label="Precio cliente"
        wrapperClassName="md:col-span-2"
      />
      <Field
        name="priceSchool"
        component={FormInput as unknown as SupportedInputs}
        placeholder="Precio escuela"
        label="Precio escuela"
        wrapperClassName="md:col-span-2"
      />
      <Field
        name="locationId"
        component={FormDropdown as unknown as SupportedInputs}
        placeholder="Sede"
        label="Sede"
        options={data || []}
        isLoading={isLoading}
        validate={(value) =>
          value !== undefined ? undefined : 'La Sede es requerida'
        }
      />
      <Field
        name="note"
        component={FormTextarea as unknown as SupportedInputs}
        type=""
        placeholder="Comentarios / Notas"
        label="Comentarios / Notas"
        wrapperClassName="md:col-span-2"
      />
    </form>
  );
};
