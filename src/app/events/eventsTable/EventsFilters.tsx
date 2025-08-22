'use client';

import { IEventFilter, IUser } from '@/lib/definitions';
import dayjs, { Dayjs } from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import { FormCalendar } from '@/components/Forms/Calendar/FormCalendar';
import {
  Field,
  Form,
  FormRenderProps,
  SupportedInputs,
} from 'react-final-form';
import { useCallback, useMemo, FormEvent, useEffect } from 'react';
import { FormDropdown } from '@/components/Forms/Dropdown/FormDropdown';
import {
  useGetInstructorListByLocationId,
  useGetLocationList,
} from '@/app/events/services/client';
import { useGetAssetsByLocationId } from '@/app/events/services/client';
import { usePathname, useRouter } from 'next/navigation';
import { CloseCircleIcon } from '@/assets/icons/CloseCircleIcon';
import { FormInput } from '@/components/Forms/Input/FormInput';
import { debounce } from 'lodash';

dayjs.extend(advancedFormat);

interface Props {
  filters: string;
  user: IUser;
}

export interface FilterUpdateProps {
  [key: string]: string | number | undefined;
}

export const EventsFilters = (props: Props) => {
  const { user, filters } = props;
  const pathname = usePathname();
  const { replace } = useRouter();
  const currentFilters = useMemo(() => {
    return filters ? (JSON.parse(atob(filters)) as IEventFilter) : {};
  }, [filters]);

  const handleReset = useCallback(() => {
    const params = new URLSearchParams();
    const newFilters = JSON.stringify({
      date: new Date(),
      locationId: props.user?.location?.id,
      instructorId: undefined,
      assetId: undefined,
      searchTerm: undefined,
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

  useEffect(() => {
    if (!filters) {
      handleReset();
    }
  }, [filters, handleReset]);

  const onSubmit = useCallback((data: IEventFilter) => {
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

export interface FiltersFormProps extends FormRenderProps<IEventFilter> {
  user: IUser;
  handleReset: () => void;
  handleFilterUpdate: (data: FilterUpdateProps) => void;
}

const FiltersForm = (props: FiltersFormProps) => {
  const { values, user, handleFilterUpdate } = props;
  const { data: locations, isLoading: isLocationsLoading } =
    useGetLocationList();
  const { data: instructors, isLoading: isInstructorsLoading } =
    useGetInstructorListByLocationId(values?.locationId);
  const { data: assets, isLoading: isAssetsLoading } =
    useGetAssetsByLocationId(values?.locationId);

  const debouncedOnFilter = useMemo(
    () =>
      debounce((value: string) => {
        handleFilterUpdate({ searchTerm: value });
      }, 1000),
    [handleFilterUpdate],
  );

  useEffect(() => {
    return () => {
      debouncedOnFilter.cancel();
    };
  }, [debouncedOnFilter]);

  return (
    <form
      id="event-filter-form"
      className="py-3 my-6 grid gap-4 md:grid-cols-3 lg:grid-cols-4"
      onSubmit={(e: FormEvent) => e.preventDefault()}
    >
      <Field
        name="searchTerm"
        component={FormInput as unknown as SupportedInputs}
        placeholder="Cliente, Cédula, Teléfono"
        label="Buscar"
        onFilter={(searchTerm: string) => {
          debouncedOnFilter(searchTerm);
        }}
      />
      <Field
        name="date"
        component={FormCalendar as unknown as SupportedInputs}
        placeholder={dayjs().format('YYYY MMM DD')}
        onFilter={(date: Dayjs) => {
          handleFilterUpdate({ date: date.toString() });
        }}
        label="Fecha"
      />

      <Field
        name="locationId"
        component={FormDropdown as unknown as SupportedInputs}
        placeholder="Sede"
        label="Sede"
        options={locations || []}
        onFilter={(value: number) => {
          handleFilterUpdate({ locationId: value });
        }}
        isLoading={isLocationsLoading}
        hidden={!(user?.access?.receptionist || user?.access?.admin)}
      />

      <Field
        name="instructorId"
        component={FormDropdown as unknown as SupportedInputs}
        placeholder="Instructor"
        label="Instructor"
        options={instructors || []}
        onFilter={(value: number) => {
          handleFilterUpdate({ instructorId: value });
        }}
        isLoading={isInstructorsLoading}
        secondaryAction={
          values.instructorId ? (
            <CloseCircleIcon
              className="hover:[&>path]:fill-secondary"
              onClick={(event) => {
                event.preventDefault();
                handleFilterUpdate({ instructorId: undefined });
              }}
            />
          ) : undefined
        }
      />

      <Field
        name="assetId"
        component={FormDropdown as unknown as SupportedInputs}
        placeholder="Vehículo"
        label="Vehículo"
        options={assets || []}
        onFilter={(value: number) => {
          handleFilterUpdate({ assetId: value });
        }}
        isLoading={isAssetsLoading}
        secondaryAction={
          values.assetId ? (
            <CloseCircleIcon
              className="hover:[&>path]:fill-secondary"
              onClick={(event) => {
                event.preventDefault();
                handleFilterUpdate({ assetId: undefined });
              }}
            />
          ) : undefined
        }
      />
    </form>
  );
};
