'use client';

import {IEventFilter, IUser} from "@/lib/definitions";
import {Button} from "@/components/ui/button";
import * as React from "react";
import dayjs, {Dayjs} from "dayjs";
import advancedFormat from 'dayjs/plugin/advancedFormat';
import {FormCalendar} from "@/components/Forms/Calendar/FormCalendar";
import {Field, Form, FormRenderProps, SupportedInputs} from "react-final-form";
import {useCallback} from "react";
import {FormDropdown} from "@/components/Forms/Dropdown/FormDropdown";
import {useGetInstructorListByLocationId, useGetLicenseList, useGetLocationList} from "@/app/events/services/client";
import {QueryCache, QueryClient, QueryClientProvider} from "react-query";
import {usePathname, useRouter} from "next/navigation";

dayjs.extend(advancedFormat);

interface Props {
    filters: string;
    user: IUser
}

interface FilterUpdateProps {
    [key: string]: string | Date | Dayjs | number;
}


export const EventsFilters = (props: Props) => {
    const {user, filters} = props
    const pathname = usePathname();
    const {replace} = useRouter();
    const currentFilters = filters ? JSON.parse(atob(filters)) : undefined;

    const handleReset = useCallback(() => {
        const params = new URLSearchParams();
        const newFilters = JSON.stringify({
            date: dayjs(),
            locationId: props.user?.location?.id,
            instructorId: props.user?.access?.instructor ? props.user?.id : undefined
        })
        params.set('filters', btoa(newFilters));
        replace(`${pathname}?${params.toString()}`);
    }, [props, replace, pathname]);

    const handleFilterUpdate = useCallback((data: FilterUpdateProps) => {
        const params = new URLSearchParams();
        const newFilters = JSON.stringify({
            ...currentFilters, ...data
        })
        params.set('filters', btoa(newFilters));
        replace(`${pathname}?${params.toString()}`);
    }, [filters, replace, currentFilters, pathname]);

    if (!filters) {
        handleReset();
    }

    const queryClient = new QueryClient({
        queryCache: new QueryCache({
            onError: error => {
                console.error('Error:', error)
            }
        })
    });

    const onSubmit = useCallback((data: IEventFilter) => {
        return data;
    }, []);

    return <QueryClientProvider client={queryClient}>
        <Form
            onSubmit={onSubmit}
            initialValues={currentFilters}
            validateOnBlur={false}
        >
            {(formProps) => <FiltersForm {...formProps} user={user} handleReset={handleReset}
                                         handleFilterUpdate={handleFilterUpdate}/>}
        </Form>
    </QueryClientProvider>
}

export interface FiltersFormProps extends FormRenderProps<IEventFilter> {
    user: IUser;
    handleReset: () => void;
    handleFilterUpdate: (data: FilterUpdateProps) => void;
}

const FiltersForm = (props: FiltersFormProps) => {
    const {values, user, handleReset, handleFilterUpdate} = props;
    const {data: locations, isLoading: isLocationsLoading} = useGetLocationList();
    const {data: licenses, isLoading: isLicensesLoading} = useGetLicenseList();
    const {
        data: instructors, isLoading: isInstructorsLoading
    } = useGetInstructorListByLocationId(values?.locationId);

    return <form
        id="event-filter-form"
        className="py-3 my-6 border-y border-solid border-primary/[0.2] grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        <div className="col-span-full flex gap-4">
            <Button
                variant="outline"
                className="text-secondary rounded-3xl border-secondary border border-solid"
                onClick={handleReset}
            >Limpiar filtros</Button>
        </div>
        <Field
            name="date"
            component={FormCalendar as unknown as SupportedInputs}
            placeholder={dayjs().format('YYYY MMM DD')}
            onFilter={(date: Dayjs) => {
                handleFilterUpdate({date})
            }}
            label="Fecha"
        />
        {(user?.access?.receptionist || user?.access?.admin) && <Field
            name="locationId"
            component={FormDropdown as unknown as SupportedInputs}
            placeholder='Sede'
            label='Sede'
            options={locations || []}
            onFilter={(value: number) => {
                handleFilterUpdate({locationId: value})
            }}
            isLoading={isLocationsLoading}
        />}

        <Field
            name="instructorId"
            component={FormDropdown as unknown as SupportedInputs}
            placeholder='Instructor'
            label='Instructor'
            options={instructors || []}
            onFilter={(value: number) => {
                handleFilterUpdate({instructorId: value})
            }}
            isLoading={isInstructorsLoading}
        />
        <Field
            name="licenseTypeId"
            component={FormDropdown as unknown as SupportedInputs}
            placeholder='Tipo licencia'
            label='Tipo licencia'
            options={licenses || []}
            onFilter={(value: number) => {
                handleFilterUpdate({licenseTypeId: value})
            }}
            isLoading={isLicensesLoading}
        />
    </form>
}