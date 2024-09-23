'use client';

import {ColumnDef} from "@tanstack/react-table";
import {ILicenseType} from "@/lib/definitions";
import {Button} from "@/components/ui/button";
import {ArrowUpDown, MoreHorizontal} from "lucide-react";
import * as React from "react";
import {DataTable} from "@/components/Table";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface Props {
    data: ILicenseType[]
}

const columns: ColumnDef<ILicenseType>[] = [{
    accessorKey: "name", header: ({column}) => {
        return (<Button
            className="px-0"
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
            className="px-0"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
            Estado
            <ArrowUpDown className="ml-2 h-4 w-4"/>
        </Button>)
    }, cell: ({row}) => <div className="capitalize">{row.getValue("status") ? 'Disponible' : 'No Disponible'}</div>,
}, {
    accessorKey: "color", header: () => {
        return (<Button
            className="px-0"
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
            className="px-0"
            variant="ghost"
        >
        Acciones
        </Button>)
    }, enableHiding: false, cell: ({row}) => {
        return (<DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4"/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem
                >
                    Editar
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>)
    },
},]

export const LicenseTableWrapper = (props: Props) => {
    const {data} = props
    return <DataTable
        data={data}
        columns={columns}
    />
}