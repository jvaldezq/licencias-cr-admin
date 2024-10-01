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
    accessorKey: "color", header: () => {
        return (<Button
            className="px-0 font-bold text-base"
            variant="ghost"
        >
            Color
        </Button>)
    }, cell: ({row}) => <div>
        <div className='rounded-full h-4 w-4' style={{ background: row.getValue('color') }}/>
    </div>,
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