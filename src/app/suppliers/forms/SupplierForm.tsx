'use client';

import { Field, FormRenderProps, SupportedInputs } from 'react-final-form';
import { FormInput } from '@/components/Forms/Input/FormInput';
import * as React from 'react';
import { ISupplier } from '@/lib/definitions';


export type FormProps = FormRenderProps<ISupplier>;

export const SupplierForm = (props: FormProps) => {
  const { handleSubmit } = props;

  return (
    <form
      id="supplier-form"
      onSubmit={handleSubmit}
      className="grid md:grid-cols-2 gap-6 py-4"
    >
      <Field
        name="businessName"
        component={FormInput as unknown as SupportedInputs}
        placeholder="Nombre del proovedor"
        label="Nombre del proovedor"
        autoFocus={true}
        validate={(value) =>
          value !== undefined ? undefined : 'El nombre del proovedor es requerido'
        }
      />
      <Field
        name="name"
        component={FormInput as unknown as SupportedInputs}
        placeholder="Nombre del contacto"
        label="Nombre del contacto"
      />
      <Field
        name="category"
        component={FormInput as unknown as SupportedInputs}
        placeholder="Categoría"
        label="Categoría"
      />
      <Field
        name="phone"
        component={FormInput as unknown as SupportedInputs}
        placeholder="Teléfono"
        label="Teléfono"
        validate={(value) =>
          value !== undefined ? undefined : 'El teléfono es requerido'
        }
      />
      <Field
        name="address"
        component={FormInput as unknown as SupportedInputs}
        placeholder="Dirección del proovedor (Google)"
        label="Dirección del proovedor (Google)"
      />
    </form>
  );
};
