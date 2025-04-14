'use client';

import { ColumnDef, Row } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
  List,
  MapPin,
  PenLine,
  Trash2,
} from 'lucide-react';
import * as React from 'react';
import { DataTable } from '@/components/Table';
import { ISupplier, IUser } from '@/lib/definitions';
import { WhatsappIcon } from '@/assets/icons/WhatsappIcon';
import { Dropdown } from '@/components/Dropdown';
import { useCallback, useState } from 'react';
import { EditSupplier } from '@/app/suppliers/forms/EditSupplier';
import { DeleteSupplier } from '@/app/suppliers/forms/DeleteSupplier';

interface Props {
  data: ISupplier[];
  user: IUser;
}

export const SupplierTable = (props: Props) => {
  const { data, user } = props;
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [id, setId] = useState('');
  const isAdmin = user?.access?.admin;

  const handleAction = useCallback((action: string, id: string) => {
    if (action === 'edit') {
      setOpenEdit(true);
    }
    if (action === 'delete') {
      setOpenDelete(true);
    }
    setId(id);
  }, []);

  const columns: ColumnDef<ISupplier>[] = [
    {
      accessorKey: 'businessName',
      header: ({ column }) => {
        return (
          <Button
            className="px-0 font-bold text-base"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Nombre
          </Button>
        );
      },
    },
    {
      accessorKey: 'name',
      header: ({ column }) => {
        return (
          <Button
            className="px-0 font-bold text-base"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Nombre Contacto
          </Button>
        );
      },
    },
    {
      accessorKey: 'category',
      header: ({ column }) => {
        return (
          <Button
            className="px-0 font-bold text-base"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Categoría
          </Button>
        );
      },
    },
    {
      accessorKey: 'phone',
      header: ({ column }) => {
        return (
          <Button
            className="px-0 font-bold text-base"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Telefono
          </Button>
        );
      },
      cell: ({ row }) => {
        const phone = `${row.getValue('phone')}` || '';
        return (
          <div className="flex gap-2 items-center">
            <a
              className="font-semibold text-primary flex gap-1 items-center"
              href={`https://wa.me/506${phone.replace(/-/g, '')}?text=`}
              target="_blank"
            >
              <WhatsappIcon className="h-4.5" />
              {phone}
            </a>
          </div>
        );
      },
    },
    {
      accessorKey: 'address',
      header: ({ column }) => {
        return (
          <Button
            className="px-0 font-bold text-base"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Dirección
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <a href={row.getValue('address')} target="_blank">
            <MapPin className="text-secondary" />
          </a>
        );
      },
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
      cell: ({ row }: { row: Row<ISupplier> }) => {
        const options = [
          {
            content: (
              <Button
                onClick={() => handleAction('edit', row?.original?.id)}
                className="w-full flex justify-start items-center gap-2 text-primary"
                variant="outline"
              >
                <PenLine /> Editar
              </Button>
            ),
            key: `view ${row?.original?.id}`,
          },
          {
            content: (
              <Button
                onClick={() => handleAction('delete', row?.original?.id)}
                className="w-full flex justify-start items-center gap-2 text-secondary"
                variant="outline"
              >
                <Trash2 /> Eliminar
              </Button>
            ),
            key: `delete ${row?.original?.id}`,
          },
        ];

        return (
          <Dropdown
            trigger={
              <Button variant="outline">
                <List />
              </Button>
            }
            options={options}
          />
        );
      },
    },
  ];

  return (
    <>
      <EditSupplier open={openEdit} setOpen={setOpenEdit} id={id} user={user} />
      <DeleteSupplier open={openDelete} setOpen={setOpenDelete} id={id} />
      <DataTable
        data={data}
        columns={columns.filter(
          (column) => !(!isAdmin && column.id === 'actions'),
        )}
      />
    </>
  );
};
