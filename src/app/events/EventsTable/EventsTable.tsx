'use client';

import {ColumnDef} from "@tanstack/react-table";
import {IEvent, IUser} from "@/lib/definitions";
import {Button} from "@/components/ui/button";
import {ArrowUpDown} from "lucide-react";
import * as React from "react";
import {DataTable} from "@/components/Table";
import dayjs from "dayjs";
import advancedFormat from 'dayjs/plugin/advancedFormat';
import {QueryCache, QueryClient, QueryClientProvider} from "react-query";

dayjs.extend(advancedFormat);

interface Props {
    filters: string;
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
        return <div className="capitalize">
            {dayjs(row?.original?.date).format('h:mm A')}
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
        return <div className="capitalize">
            {dayjs(row?.original?.date).format('h:mm A')}
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
}]

export const EventsTable = (props: Props) => {
    const {data} = props

    const queryClient = new QueryClient({
        queryCache: new QueryCache({
            onError: error => {
                console.error('Error:', error)
            }
        })
    });

    return <QueryClientProvider client={queryClient}>
        {data ? <DataTable
            data={data}
            columns={columns}
        /> : <div className="flex justify-center items-center">No hay datos</div>}
    </QueryClientProvider>
}