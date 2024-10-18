'use client';

import {ColumnDef} from "@tanstack/react-table";
import {ILocation} from "@/lib/definitions";
import {Button} from "@/components/ui/button";
import {ArrowUpDown} from "lucide-react";
import * as React from "react";
import {DataTable} from "@/components/Table";
import {EditLocation} from "@/app/locations/forms/EditLocation";
import {DeleteLocation} from "@/app/locations/forms/DeleteLocation";

interface Props {
    data: ILocation[]
}

const columns: ColumnDef<ILocation>[] = [{
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
    accessorKey: "status", header: ({column}) => {
        return (<Button
            className="px-0 font-bold text-base"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
            Estado
            <ArrowUpDown className="ml-2 h-4 w-4"/>
        </Button>)
    }, cell: ({row}) => <div className="capitalize">{row.getValue("status") ? 'Disponible' : 'No Disponible'}</div>,
}, {
    id: "actions", header: () => {
        return (<Button
            className="px-0 font-bold text-base"
            variant="ghost"
        >
            Acciones
        </Button>)
    }, enableHiding: false, cell: ({row}) => {
        return <div className="flex gap-4">
            <EditLocation id={row.original.id}/>
            <DeleteLocation id={row.original.id}/>
        </div>
    },
},]

export const LocationsTable = (props: Props) => {
    const {data} = props
    return <DataTable
        data={data}
        columns={columns}
    />
}