'use client';

import { IAssetFilter, IUser } from '@/lib/definitions';
import {
  Field,
  Form,
  FormRenderProps,
  SupportedInputs,
} from 'react-final-form';
import { useCallback, useMemo, FormEvent } from 'react';
import { FormDropdown } from '@/components/Forms/Dropdown/FormDropdown';
import { useGetLocationList } from '@/app/events/services/client';
import { usePathname, useRouter } from 'next/navigation';
import { useGetLicenseList } from '@/app/assets/services/client';
import { Button } from '@/components/ui/button';
import * as React from 'react';

interface Props {
  filters: string;
  user: IUser;
}

export interface FilterUpdateProps {
  [key: string]: string | number | undefined;
}

export const AssetsFilters = (props: Props) => {
  const { user, filters } = props;
  const pathname = usePathname();
  const { replace } = useRouter();
  const currentFilters = useMemo(() => {
    return filters ? (JSON.parse(atob(filters)) as IAssetFilter) : {};
  }, [filters]);

  const handleReset = useCallback(() => {
    replace(`${pathname}`);
  }, [replace, pathname]);

  const handleFilterUpdate = useCallback(
    (data: FilterUpdateProps) => {
      const params = new URLSearchParams();
      const newFilters = JSON.stringify({
        ...currentFilters,
        ...data,
      });
      params.set('filters', btoa(newFilters));
      replace(`${pathname}?${params.toString()}`);
    },
    [replace, pathname, currentFilters],
  );

  const onSubmit = useCallback((data: IAssetFilter) => {
    return data;
  }, []);

  return (
    <Form onSubmit={onSubmit} initialValues={currentFilters}>
      {(formProps) => (
        <FiltersForm
          {...formProps}
          user={user}
          handleReset={handleReset}
          handleFilterUpdate={handleFilterUpdate}
        />
      )}
    </Form>
  );
};

export interface FiltersFormProps extends FormRenderProps<IAssetFilter> {
  user: IUser;
  handleReset: () => void;
  handleFilterUpdate: (data: FilterUpdateProps) => void;
}

const FiltersForm = (props: FiltersFormProps) => {
  const { handleFilterUpdate, handleReset, values } = props;
  const { data: licenses } = useGetLicenseList();
  const { data: locations } = useGetLocationList();

  return (
      <form
        id="asset-filter-form"
        className="py-3 my-6 grid gap-4 md:grid-cols-3 lg:grid-cols-4 items-end"
        onSubmit={(e: FormEvent) => e.preventDefault()}
      >
        <Field
          name="locationId"
          component={FormDropdown as unknown as SupportedInputs}
          placeholder="Sede"
          label="Sede"
          options={locations || []}
          onFilter={(value: number) => {
            handleFilterUpdate({ locationId: value });
          }}
        />

        <Field
          name="licenseTypeId"
          component={FormDropdown as unknown as SupportedInputs}
          placeholder="Tipo licencia"
          label="Tipo licencia"
          options={licenses || []}
          onFilter={(value: number) => {
            handleFilterUpdate({ licenseTypeId: value });
          }}
        />
        {(values?.licenseTypeId || values?.locationId) && (
          <Button
            variant="secondary"
            type="button"
            onClick={handleReset}
            className="bg-secondary text-white rounded-3xl animate-fade-right animate-once animate-duration-500 animate-delay-100 animate-ease-in"
          >
            Limpiar filtros
          </Button>
        )}
      </form>
  );
};
