// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
'use client';

import * as React from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { EventStatus } from '@/lib/definitions';

interface Props<T> {
  data: T[];
  columns: ColumnDef<T>[];
  className?: string;
}

export function DataTable<T>(props: Props<T>) {
  const { data, columns, className } = props;
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting, // onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(), // getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(), // getFilteredRowModel: getFilteredRowModel(),
    // onColumnVisibilityChange: setColumnVisibility,
    // onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <Table
      className={cn(
        'animate-fade-down animate-once animate-duration-500 animate-delay-0 animate-ease-in',
        className,
      )}
    >
      <TableHeader>
        {table?.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup?.id}>
            {headerGroup?.headers.map((header) => {
              return (
                <TableHead key={header?.id}>
                  {header?.isPlaceholder
                    ? null
                    : flexRender(
                        header?.column?.columnDef?.header,
                        header?.getContext(),
                      )}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table?.getRowModel().rows?.length ? (
          table?.getRowModel().rows.map((row) => {
            const classStyle = [
              EventStatus.PRACTICING,
              EventStatus.COMPLETED,
            ].includes(row?.original?.status)
              ? 'bg-yellow-500/[0.3]'
              : row?.original?.type?.name?.includes('Clase')
                ? 'bg-[#8e24aa]/[0.3]'
                : '';

            return (
              <TableRow
                key={row?.id}
                data-state={row?.getIsSelected() && 'selected'}
                className={cn(classStyle)}
              >
                {row
                  ?.getVisibleCells()
                  .map((cell) => (
                    <TableCell key={cell?.id}>
                      {flexRender(
                        cell?.column?.columnDef?.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
              </TableRow>
            );
          })
        ) : (
          <TableRow>
            <TableCell colSpan={columns?.length} className="h-24 text-center">
              No hay resultados.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
