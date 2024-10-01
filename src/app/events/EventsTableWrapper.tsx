'use client';

import {ColumnDef} from "@tanstack/react-table";
import {IEvent, IUser} from "@/lib/definitions";
import {Button} from "@/components/ui/button";
import {ArrowUpDown} from "lucide-react";
import * as React from "react";
import {DataTable} from "@/components/Table";
import dayjs from "dayjs";
import advancedFormat from 'dayjs/plugin/advancedFormat';

dayjs.extend(advancedFormat);

interface Props {
    data: IEvent[]
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
        const licenseType = row?.original?.licenseType?.name ? `(${row?.original?.licenseType?.name})`: undefined;
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
    const {data} = props
    return <DataTable
        data={data}
        columns={columns}
    />
}