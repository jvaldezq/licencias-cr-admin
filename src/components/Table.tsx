"use client"

import * as React from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {ILicenseType, ILocation} from "@/lib/definitions";


interface Props<T> {
    data: T[]
    columns: ColumnDef<T>[]
}

export function DataTable<T>(props: Props<T>) {
    const {data, columns} = props
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting, columnFilters, columnVisibility, rowSelection,
        },
    })

    return (<Table className="animate-fade-down animate-once animate-duration-500 animate-delay-0 animate-ease-in">
        <TableHeader>
            {table?.getHeaderGroups().map((headerGroup) => (<TableRow key={headerGroup?.id}>
                {headerGroup?.headers.map((header) => {
                    return (<TableHead key={header?.id}>
                        {header?.isPlaceholder ? null : flexRender(header?.column?.columnDef?.header, header?.getContext())}
                    </TableHead>)
                })}
            </TableRow>))}
        </TableHeader>
        <TableBody>
            {table?.getRowModel().rows?.length ? (table?.getRowModel().rows.map((row) => (<TableRow
                key={row?.id}
                data-state={row?.getIsSelected() && "selected"}
            >
                {row?.getVisibleCells().map((cell) => (<TableCell key={cell?.id}>
                    {flexRender(cell?.column?.columnDef?.cell, cell.getContext())}
                </TableCell>))}
            </TableRow>))) : (<TableRow>
                <TableCell
                    colSpan={columns?.length}
                    className="h-24 text-center"
                >
                    No hay resultados.
                </TableCell>
            </TableRow>)}
        </TableBody>
    </Table>)
}