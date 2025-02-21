'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, NotebookPen } from 'lucide-react';
import * as React from 'react';
import { DataTable } from '@/components/Table';
import { IAsset, ILicenseType, ILocation, IUser } from '@/lib/definitions';
import { DeleteAsset } from '@/app/assets/forms/DeleteAsset';
import { EditAsset } from '@/app/assets/forms/EditAsset';
import { useLogContext } from '@/context/LogsContext';

interface Props {
  data: IAsset[];
  user: IUser;
}

export const AssetsTable = (props: Props) => {
  const { data, user } = props;
  const { showLogs } = useLogContext();

  const handleLogsClick = (id: string) => {
    showLogs({ assetId: id });
  };

  const columns: ColumnDef<IAsset>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => {
        return (
          <Button
            className="px-0 font-bold text-base"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Nombre
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('name')}</div>
      ),
    },
    {
      accessorKey: 'plate',
      header: ({ column }) => {
        return (
          <Button
            className="px-0 font-bold text-base"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Placa
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('plate')}</div>
      ),
    },
    {
      accessorKey: 'location',
      header: ({ column }) => {
        return (
          <Button
            className="px-0 font-bold text-base"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Sede
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const location = row.getValue('location') as ILocation;
        return <div className="capitalize">{location?.name}</div>;
      },
    },
    {
      accessorKey: 'licenseType',
      header: ({ column }) => {
        return (
          <Button
            className="px-0 font-bold text-base"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Tipo licencia
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const license = row.getValue('licenseType') as ILicenseType;
        return <div className="capitalize">{license?.name}</div>;
      },
    },
    {
      accessorKey: 'status',
      header: ({ column }) => {
        return (
          <Button
            className="px-0 font-bold text-base"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Estado
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize">
          {row.getValue('status') ? 'Disponible' : 'No Disponible'}
        </div>
      ),
    },
    {
      id: 'actions',
      header: () => {
        return (
          <Button className="px-0 font-bold text-base" variant="ghost">
            Acciones
          </Button>
        );
      },
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <div className="flex gap-4">
            <EditAsset id={row.original.id} />
            {user?.access?.admin && <DeleteAsset id={row.original.id} />}
            {user?.access?.admin && (
              <Button
                variant="outline"
                onClick={() => handleLogsClick(`${row.original.id}`)}
              >
                <NotebookPen className="text-primary h-5" />
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  return <DataTable data={data} columns={columns} />;
};
