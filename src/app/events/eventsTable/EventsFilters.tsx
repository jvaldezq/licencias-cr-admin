'use client';

import {IEventFilter, IUser} from "@/lib/definitions";
import * as React from "react";
import dayjs, {Dayjs} from "dayjs";
import advancedFormat from 'dayjs/plugin/advancedFormat';
import {FormCalendar} from "@/components/Forms/Calendar/FormCalendar";
import {Field, Form, FormRenderProps, SupportedInputs} from "react-final-form";
import {useCallback, useMemo} from "react";
import {FormDropdown} from "@/components/Forms/Dropdown/FormDropdown";
import {useGetInstructorListByLocationId, useGetLicenseList, useGetLocationList} from "@/app/events/services/client";
import {usePathname, useRouter} from "next/navigation";
import {CloseCircleIcon} from "@/assets/icons/CloseCircleIcon";

dayjs.extend(advancedFormat);

interface Props {
    filters: string;
    user: IUser
}

export interface FilterUpdateProps {
    [key: string]: string | number | undefined;
}


export const EventsFilters = (props: Props) => {
    const {user, filters} = props
    const pathname = usePathname();
    const {replace} = useRouter();
    const currentFilters = useMemo(() => {
        return filters ? JSON.parse(atob(filters)) as IEventFilter : {}
    }, [filters]);
    const instructorId =
        !props.user?.access?.receptionist && !props.user?.access?.admin && user?.access?.instructor ? user?.id : undefined;

    const handleReset = useCallback(() => {
        const params = new URLSearchParams();
        const newFilters = JSON.stringify({
            date: new Date(),
            locationId: props.user?.location?.id,
            instructorId: instructorId
        })
        params.set('filters', btoa(newFilters));
        replace(`${pathname}?${params.toString()}`);
    }, [props.user?.location?.id, instructorId, replace, pathname]);

    const handleFilterUpdate = useCallback((data: FilterUpdateProps) => {
        const params = new URLSearchParams();
        const newFilters = JSON.stringify({
            ...currentFilters, ...data
        })
        params.set('filters', btoa(newFilters));
        replace(`${pathname}?${params.toString()}`);
    }, [replace, pathname, currentFilters]);

    if (!filters) {
        handleReset();
    }

    const onSubmit = useCallback((data: IEventFilter) => {
        return data;
    }, []);

    return <Form
        onSubmit={onSubmit}
        initialValues={currentFilters}
        validateOnBlur={false}
    >
        {(formProps) => <FiltersForm {...formProps} user={user} handleReset={handleReset}
                                     handleFilterUpdate={handleFilterUpdate}/>}
    </Form>
}

export interface FiltersFormProps extends FormRenderProps<IEventFilter> {
    user: IUser;
    handleReset: () => void;
    handleFilterUpdate: (data: FilterUpdateProps) => void;
}

const FiltersForm = (props: FiltersFormProps) => {
    const {values, user, handleFilterUpdate} = props;
    const {data: locations, isLoading: isLocationsLoading} = useGetLocationList();
    const {data: licenses, isLoading: isLicensesLoading} = useGetLicenseList();
    const {
        data: instructors, isLoading: isInstructorsLoading
    } = useGetInstructorListByLocationId(values?.locationId);

    return <form
        id="event-filter-form"
        className="py-3 my-6 grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        <Field
            name="date"
            component={FormCalendar as unknown as SupportedInputs}
            placeholder={dayjs().format('YYYY MMM DD')}
            onFilter={(date: Dayjs) => {
                handleFilterUpdate({date: date.toString()})
            }}
            label="Fecha"
        />

        <Field
            name="locationId"
            component={FormDropdown as unknown as SupportedInputs}
            placeholder='Sede'
            label='Sede'
            options={locations || []}
            onFilter={(value: number) => {
                handleFilterUpdate({locationId: value})
            }}
            isLoading={isLocationsLoading}
            hidden={!(user?.access?.receptionist || user?.access?.admin)}
        />

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
            secondaryAction={values.instructorId ?
                <CloseCircleIcon className="hover:[&>path]:fill-secondary" onClick={(event) => {
                    event.preventDefault();
                    handleFilterUpdate({instructorId: undefined})
                }}/> : undefined}
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
            secondaryAction={values.licenseTypeId ?
                <CloseCircleIcon className="hover:[&>path]:fill-secondary" onClick={(event) => {
                    event.preventDefault();
                    handleFilterUpdate({licenseTypeId: undefined})
                }}/> : undefined}
        />
    </form>
}