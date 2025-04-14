'use client';

import { Field, FormRenderProps, SupportedInputs } from 'react-final-form';
import { FormInput } from '@/components/Forms/Input/FormInput';
import * as React from 'react';
import {
  useGetLicenseList,
  useGetLocationList,
} from '@/app/assets/services/client';
import { FormSwitch } from '@/components/Forms/Switch/FormSwitch';
import { FormDropdown } from '@/components/Forms/Dropdown/FormDropdown';
import { FormTextarea } from '@/components/Forms/Textarea/FormTextarea';

export interface AssetFormProps {
  name: string;
  plate: string;
  status: boolean;
  locationId: string;
  licenseTypeId: string;
  note?: string;
}

export type FormProps = FormRenderProps<AssetFormProps>;

export const AssetForm = (props: FormProps) => {
  const { handleSubmit } = props;
  const { data, isLoading } = useGetLocationList();
  const { data: licenses, isLoading: isLicensesLoading } = useGetLicenseList();

  return (
    <form
      id="asset-form"
      onSubmit={handleSubmit}
      className="grid md:grid-cols-2 gap-6 py-4"
    >
      <Field
        name="name"
        component={FormInput as unknown as SupportedInputs}
        placeholder="Nombre"
        label="Nombre"
        autoFocus={true}
        validate={(value) =>
          value !== undefined ? undefined : 'El nombre es requerido'
        }
      />
      <Field
        name="plate"
        component={FormInput as unknown as SupportedInputs}
        placeholder="Placa"
        label="Placa"
        validate={(value) =>
          value !== undefined ? undefined : 'La placa es requerida'
        }
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
        name="licenseTypeId"
        component={FormDropdown as unknown as SupportedInputs}
        placeholder="Tipo licencia"
        label="Tipo licencia"
        options={licenses || []}
        isLoading={isLicensesLoading}
        validate={(value) =>
          value !== undefined ? undefined : 'El tipo de licencia es requerido'
        }
      />
      <Field
        name="status"
        component={FormSwitch as unknown as SupportedInputs}
        placeholder="Activo"
        label="Activo"
      />
      <Field
        name="note"
        component={FormTextarea as unknown as SupportedInputs}
        type=""
        placeholder="Comentarios/Notas"
        label="Comentarios/Notas"
        wrapperClassName="md:col-span-2"
      />
    </form>
  );
};
