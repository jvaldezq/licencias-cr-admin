'use client';

import {ColumnDef} from "@tanstack/react-table";
import {IEvent, IEventFilter, IUser} from "@/lib/definitions";
import {Button} from "@/components/ui/button";
import {ArrowUpDown} from "lucide-react";
import * as React from "react";
import {DataTable} from "@/components/Table";
import dayjs from "dayjs";
import advancedFormat from 'dayjs/plugin/advancedFormat';
import {FormCalendar} from "@/components/Forms/Calendar/FormCalendar";
import {Field, Form, FormRenderProps, SupportedInputs} from "react-final-form";
import {useCallback, useEffect} from "react";
import {FormDropdown} from "@/components/Forms/Dropdown/FormDropdown";
import {useGetInstructorListByLocationId, useGetLicenseList, useGetLocationList} from "@/app/events/clientService";
import {QueryCache, QueryClient, QueryClientProvider} from "react-query";
import {usePathname, useRouter, useSearchParams} from "next/navigation";

dayjs.extend(advancedFormat);

interface Props {
    data: IEvent[]
    user: IUser
}

const columns: ColumnDef<IEvent>[] = [{
    accessorKey: "schedule.startDate", header: ({column}) => {
        return (<Button
            className="px-0 font-bold text-base"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
            Inicio
            <ArrowUpDown className="ml-2 h-4 w-4"/>
        </Button>)
    }, cell: ({row}) => {
        const schedule = row?.original?.schedule;
        return <div className="capitalize">
            {dayjs(schedule?.startDate).format('h:mm A')}
        </div>
    },
}, {
    accessorKey: "schedule.endDate", header: ({column}) => {
        return (<Button
            className="px-0 font-bold text-base"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
            Fin
            <ArrowUpDown className="ml-2 h-4 w-4"/>
        </Button>)
    }, cell: ({row}) => {
        const schedule = row?.original?.schedule;
        return <div className="capitalize">
            {dayjs(schedule?.endDate).format('h:mm A')}
        </div>
    },
}, {
    accessorKey: "type.name", header: ({column}) => {
        return (<Button
            className="px-0 font-bold text-base"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
            Prueba/Clase
            <ArrowUpDown className="ml-2 h-4 w-4"/>
        </Button>)
    }, cell: ({row}) => {
        const name = row?.original?.type?.name;
        return <div className="capitalize">
            {name}
        </div>
    },
}, {
    accessorKey: "instructor.name", header: ({column}) => {
        return (<Button
            className="px-0 font-bold text-base"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
            Instructor
            <ArrowUpDown className="ml-2 h-4 w-4"/>
        </Button>)
    }, cell: ({row}) => {
        const name = row?.original?.instructor?.name || 'Sin asignar';
        return <div className="capitalize flex gap-2 items-center">
            {!row?.original?.instructor?.name &&
                <div className="h-4 w-4 rounded-full" style={{backgroundColor: '#d3d3d3'}}/>}
            {name}
        </div>
    },
}, {
    accessorKey: "asset.name", header: ({column}) => {
        return (<Button
            className="px-0 font-bold text-base"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
            Vehículo
            <ArrowUpDown className="ml-2 h-4 w-4"/>
        </Button>)
    }, cell: ({row}) => {
        const name = row?.original?.asset?.name || 'Sin asignar';
        const color = row?.original?.licenseType?.color || '#d3d3d3';
        const licenseType = row?.original?.licenseType?.name ? `(${row?.original?.licenseType?.name})` : undefined;
        return <div className="capitalize flex gap-2 items-center">
            <div className="h-4 w-4 rounded-full" style={{backgroundColor: color}}/>
            {`${licenseType} ${name}`}
        </div>
    },
}, {
    accessorKey: "customer.name", header: ({column}) => {
        return (<Button
            className="px-0 font-bold text-base"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
            Cliente
            <ArrowUpDown className="ml-2 h-4 w-4"/>
        </Button>)
    }, cell: ({row}) => {
        const name = row?.original?.customer?.name;
        return <div className="capitalize">
            {name}
        </div>
    },
}
//     {
//     id: "actions", header: () => {
//         return (<Button
//             className="px-0 font-bold text-base"
//             variant="ghost"
//         >
//         Acciones
//         </Button>)
//     }, enableHiding: false, cell: ({row}) => {
//         return <EditEventsWrapper id={row.original.id} />
//     },
// },
]

export const EventsTableWrapper = (props: Props) => {
    const {data, user} = props
    const searchParams = useSearchParams();
    const {replace} = useRouter();
    const pathname = usePathname();
    const queryClient = new QueryClient({
        queryCache: new QueryCache({
            onError: error => {
                console.error('Error:', error)
            }
        })
    });

    const instructorId = user?.access?.instructor ? user?.id : undefined;

    const onSubmit = useCallback((data: IEventFilter) => {
        const params = new URLSearchParams(searchParams);
        const paramsObj = JSON.stringify({
            locationId: data?.locationId,
            instructorId: data?.instructorId,
            licenseTypeId: data?.licenseTypeId,
            date: data?.date
        })
        params.set('filters', btoa(paramsObj));
        replace(`${pathname}?${params.toString()}`);
    }, [pathname, replace, searchParams]);

    return <QueryClientProvider client={queryClient}>
        <Form
            onSubmit={onSubmit}
            initialValues={{
                date: new Date(), locationId: user?.location?.id, instructorId: instructorId
            }}
            validateOnBlur={false}
        >
            {(formProps) => <FiltersForm {...formProps} user={user}/>}
        </Form>

        <DataTable
            data={data}
            columns={columns}
        />
    </QueryClientProvider>
}

export interface FiltersFormProps extends FormRenderProps<IEventFilter> {
    user: IUser
}

const FiltersForm = (props: FiltersFormProps) => {
    const {values, form, user, handleSubmit} = props;
    const {data: locations, isLoading: isLocationsLoading} = useGetLocationList();
    const {data: licenses, isLoading: isLicensesLoading} = useGetLicenseList();
    const {
        data: instructors, isLoading: isInstructorsLoading
    } = useGetInstructorListByLocationId(values?.locationId);

    return <form
        id="event-filter-form"
        onSubmit={handleSubmit}
        className="py-3 my-6 border-y border-solid border-primary/[0.2] grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        <div className="col-span-full flex gap-4">
            <Button
                variant="outline"
                className="text-secondary rounded-3xl border-secondary border border-solid"
                onClick={() => {
                    form.reset()
                }}
            >Limpiar filtros</Button>
            <Button
                type="submit" form="event-filter-form"
                className="bg-secondary text-white rounded-3xl">Filtrar</Button>
        </div>
        <Field
            name="date"
            component={FormCalendar as unknown as SupportedInputs}
            placeholder={dayjs().format('YYYY MMM DD')}
            label="Fecha"
        />
        {(user?.access?.receptionist || user?.access?.admin) && <Field
            name="locationId"
            component={FormDropdown as unknown as SupportedInputs}
            placeholder='Sede'
            label='Sede'
            options={locations || []}
            isLoading={isLocationsLoading}
        />}

        <Field
            name="instructorId"
            component={FormDropdown as unknown as SupportedInputs}
            placeholder='Instructor'
            label='Instructor'
            options={instructors || []}
            isLoading={isInstructorsLoading}
        />
        <Field
            name="licenseTypeId"
            component={FormDropdown as unknown as SupportedInputs}
            placeholder='Tipo licencia'
            label='Tipo licencia'
            options={licenses || []}
            isLoading={isLicensesLoading}
        />
    </form>
}