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
import {EditAssetWrapper} from "@/app/assets/AssetForm";
import {EditLicenseWrapper} from "@/app/licenses/LicenseForm";

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
        return <EditLicenseWrapper id={row.original.id} />
    },
},]

export const LicenseTableWrapper = (props: Props) => {
    const {data} = props
    return <DataTable
        data={data}
        columns={columns}
    />
}