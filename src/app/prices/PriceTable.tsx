'use client';

import { ColumnDef, Row } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { List, PenLine, SquareX } from 'lucide-react';
import * as React from 'react';
import { DataTable } from '@/components/Table';
import { IUser, IBasePrice } from '@/lib/definitions';
import { DeletePrice } from '@/app/prices/forms/DeletePrice';
import { EditPrice } from '@/app/prices/forms/EditPrice';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Dropdown } from '@/components/Dropdown';
import 'dayjs/locale/es';
import { useCallback, useState } from 'react';
import { DeleteIcon } from '@/assets/icons/DeleteIcon';
import { CRCFormatter } from '@/lib/NumberFormats';

dayjs.extend(relativeTime);
dayjs.locale('es');

interface Props {
  data: IBasePrice[];
  user: IUser;
}

export const PriceTable = (props: Props) => {
  const { data = [], user } = props;
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [id, setId] = useState('');

  const handleAction = useCallback((action: string, id: string) => {
    if (action === 'edit') {
      setOpenEdit(true);
    }
    if (action === 'delete') {
      setOpenDelete(true);
    }
    setId(id);
  }, []);

  const columns: ColumnDef<IBasePrice>[] = [
    {
      accessorKey: 'description',
      header: () => {
        return (
          <Button className="px-0 font-bold text-base" variant="ghost">
            Paquetes
          </Button>
        );
      },
    },
    {
      accessorKey: 'priceClient',
      header: () => {
        return (
          <Button className="px-0 font-bold text-base" variant="ghost">
            Precio cliente
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize">
          {CRCFormatter(row.getValue('priceClient'))}
        </div>
      ),
    },
    {
      accessorKey: 'priceSchool',
      header: () => {
        return (
          <Button className="px-0 font-bold text-base" variant="ghost">
            Precio escuela
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize">
          {CRCFormatter(row.getValue('priceSchool'))}
        </div>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: () => {
        return (
          <Button className="px-0 font-bold text-base" variant="ghost">
            Adelanto
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize">
          {CRCFormatter(row.original.priceClient - row.original.priceSchool)}
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
      cell: ({ row }: { row: Row<IBasePrice> }) => {
        const options = [];

        if (user.access?.admin) {
          options.push(
            {
              content: (
                <Button
                  className="w-full flex justify-start items-center gap-2 text-primary"
                  variant="outline"
                  onClick={() => handleAction('edit', row?.original?.id)}
                >
                  <PenLine /> Editar
                </Button>
              ),
              key: `edit ${row?.original?.id}`,
            },
            {
              content: (
                <Button
                  className="w-full flex justify-start items-center gap-2 text-error"
                  variant="outline"
                  onClick={() => handleAction('delete', row?.original?.id)}
                >
                  <DeleteIcon /> Eliminar
                </Button>
              ),
              key: `delete ${row?.original?.id}`,
            },
          );
        } else {
          return <SquareX />;
        }

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
      <DeletePrice id={id} open={openDelete} setOpen={setOpenDelete} />
      <EditPrice id={id} open={openEdit} setOpen={setOpenEdit} />
      <DataTable data={data} columns={columns} />
    </>
  );
};
