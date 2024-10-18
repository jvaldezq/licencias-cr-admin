'use client';

import {ColumnDef} from "@tanstack/react-table";
import {ILicenseType} from "@/lib/definitions";
import {Button} from "@/components/ui/button";
import {ArrowUpDown} from "lucide-react";
import * as React from "react";
import {DataTable} from "@/components/Table";
import {EditLicense} from "@/app/licenses/forms/EditLicense";
import {DeleteLicense} from "@/app/licenses/forms/DeleteLicense";

interface Props {
    data: ILicenseType[]
}

const columns: ColumnDef<ILicenseType>[] = [{
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
        <div className='rounded-full h-4 w-4' style={{background: row.getValue('color')}}/>
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
        return <div className="flex gap-4">
            <EditLicense id={row.original.id}/>
            <DeleteLicense id={row.original.id}/>
        </div>
    },
},]

export const LicenseTable = (props: Props) => {
    const {data} = props
    return <DataTable
        data={data}
        columns={columns}
    />
}