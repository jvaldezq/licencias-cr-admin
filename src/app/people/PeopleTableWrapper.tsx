'use client';

import {ColumnDef} from "@tanstack/react-table";
import {IUser} from "@/lib/definitions";
import {Button} from "@/components/ui/button";
import {ArrowUpDown} from "lucide-react";
import * as React from "react";
import {DataTable} from "@/components/Table";
import {EditPeopleWrapper} from "@/app/people/PeopleForm";

interface Props {
    data: IUser[]
}

const columns: ColumnDef<IUser>[] = [{
    accessorKey: "name", header: ({column}) => {
        return (<Button
            className="px-0 font-bold text-base"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
            Nombre
            <ArrowUpDown className="ml-2 h-4 w-4"/>
        </Button>)
    }, cell: ({row}) => <div className="capitalize">{row.getValue("name")}</div>,
}, {
    accessorKey: "location.name", header: () => {
        return (<Button
            className="px-0 font-bold text-base"
            variant="ghost"
        >
            Sede
        </Button>)
    }, cell: ({row}) => <div className="capitalize">{row?.original?.location?.name}</div>,
}, {
    accessorKey: "access.instructor", header: () => {
        return (<Button
            className="px-0 font-bold text-base"
            variant="ghost"
        >
            Instructor
        </Button>)
    }, cell: ({row}) => {
        const className = row?.original?.access?.instructor ? "bg-secondary border-secondary" : "border-secondary"
        return <div className={`capitalize h-4 w-4 rounded-full border-solid border-2 ${className}`} />
    },
}, {
    accessorKey: "access.receptionist", header: () => {
        return (<Button
            className="px-0 font-bold text-base"
            variant="ghost"
        >
            Recepcionista
        </Button>)
    }, cell: ({row}) => {
        const className = row?.original?.access?.receptionist ? "bg-secondary border-secondary" : "border-secondary"
        return <div className={`capitalize h-4 w-4 rounded-full border-solid border-2 ${className}`} />
    },
}, {
    id: "actions", header: () => {
        return (<Button
            className="px-0 font-bold text-base"
            variant="ghost"
        >
        Acciones
        </Button>)
    }, enableHiding: false, cell: ({row}) => {
        return <EditPeopleWrapper id={row.original.id} />
    },
},]

export const PeopleTableWrapper = (props: Props) => {
    const {data} = props
    return <DataTable
        data={data}
        columns={columns}
    />
}