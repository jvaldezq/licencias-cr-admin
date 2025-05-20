'use client';

import { IPriceFilter, IUser } from '@/lib/definitions';
import {
  Field,
  Form,
  FormRenderProps,
  SupportedInputs,
} from 'react-final-form';
import { useCallback, useMemo, FormEvent, useEffect } from 'react';
import { FormDropdown } from '@/components/Forms/Dropdown/FormDropdown';
import { useGetLocationList } from '@/app/events/services/client';
import { usePathname, useRouter } from 'next/navigation';
import * as React from 'react';

interface Props {
  filters: string;
  user: IUser;
}

export interface FilterUpdateProps {
  [key: string]: string | number | undefined;
}

export const PricesFilters = (props: Props) => {
  const { user, filters } = props;
  const pathname = usePathname();
  const { replace } = useRouter();
  const currentFilters = useMemo(() => {
    return filters ? (JSON.parse(atob(filters)) as IPriceFilter) : {};
  }, [filters]);

  const handleReset = useCallback(() => {
    const params = new URLSearchParams();
    const newFilters = JSON.stringify({
      locationId: props.user?.location?.id,
    });
    params.set('filters', btoa(newFilters));
    replace(`${pathname}?${params.toString()}`);
  }, [props.user?.location?.id, replace, pathname]);


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

  const onSubmit = useCallback((data: IPriceFilter) => {
    return data;
  }, []);

  useEffect(() => {
    if (!filters) {
      handleReset();
    }
  }, [filters, handleReset]);

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

export interface FiltersFormProps extends FormRenderProps<IPriceFilter> {
  user: IUser;
  handleReset: () => void;
  handleFilterUpdate: (data: FilterUpdateProps) => void;
}

const FiltersForm = (props: FiltersFormProps) => {
  const { handleFilterUpdate } = props;
  const { data: locations } = useGetLocationList();

  return (
    <form
      id="price-filter-form"
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
    </form>
  );
};
