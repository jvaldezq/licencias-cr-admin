'use client';

import { ColumnDef, Row } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, List, NotebookPen, PenLine, ScanEye } from 'lucide-react';
import * as React from 'react';
import { DataTable } from '@/components/Table';
import { IAsset, ILicenseType, ILocation, IUser } from '@/lib/definitions';
import { DeleteAsset } from '@/app/assets/forms/DeleteAsset';
import { EditAsset } from '@/app/assets/forms/EditAsset';
import { useLogContext } from '@/context/LogsContext';
import dayjs from 'dayjs';
import { cn } from '@/lib/utils';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Dropdown } from '@/components/Dropdown';
import 'dayjs/locale/es';
import { CarChecks } from '@/app/assets/forms/CarChecks';
import { useCallback, useState } from 'react';
import { DeleteIcon } from '@/assets/icons/DeleteIcon';

dayjs.extend(relativeTime);
dayjs.locale('es');

interface Props {
  data: IAsset[];
  user: IUser;
}

interface DateStatusResult {
  message: string;
  color: string;
}

export const calculateDateStatus = (dateString: string | Date): DateStatusResult => {
  const pastDate = dayjs(dateString);
  const now = dayjs();
  const diffInDays = now.diff(pastDate, 'day');

  let message = '';
  let color = '';

  if (diffInDays >= 0 && diffInDays <= 5) {
    message = pastDate.fromNow(); // "Hace X días"
    color = 'text-success';
  } else if (diffInDays >= 6 && diffInDays <= 10) {
    message = pastDate.fromNow();
    color = 'text-warning font-semibold';
  } else {
    message = pastDate.fromNow();
    color = 'text-error font-bold';
  }

  return { message, color };
};

export const AssetsTable = (props: Props) => {
  const { data, user } = props;
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openCarChecks, setOpenCarChecks] = useState(false);
  const [id, setId] = useState('');
  const { showLogs } = useLogContext();

  const handleLogsClick = (id: string) => {
    showLogs({ assetId: id });
  };

  const handleAction = useCallback((action: string, id: string) => {
    if (action === 'edit') {
      setOpenEdit(true);
    }
    if (action === 'delete') {
      setOpenDelete(true);
    }
    if (action === 'checks') {
      setOpenCarChecks(true);
    }
    setId(id);
  }, []);

  const columns: ColumnDef<IAsset>[] = [
    {
      accessorKey: 'name',
      header: () => {
        return (
          <Button
            className="px-0 font-bold text-base"
            variant="ghost"
          >
            Nombre
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('name')}</div>
      ),
    },
    {
      accessorKey: 'plate',
      header: () => {
        return (
          <Button
            className="px-0 font-bold text-base"
            variant="ghost"
          >
            Placa
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('plate')}</div>
      ),
    },
    {
      accessorKey: 'location',
      header: () => {
        return (
          <Button
            className="px-0 font-bold text-base"
            variant="ghost"
          >
            Sede
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
      header: () => {
        return (
          <Button
            className="px-0 font-bold text-base"
            variant="ghost"
          >
            Tipo licencia
          </Button>
        );
      },
      cell: ({ row }) => {
        const license = row.getValue('licenseType') as ILicenseType;
        return <div className="capitalize">{license?.name}</div>;
      },
    },
    {
      accessorKey: 'coolantDate',
      header: () => {
        return (
          <Button
            className="px-0 font-bold text-base"
            variant="ghost"
          >
            Coolant
          </Button>
        );
      },
      cell: ({ row }) => {
        const {message, color} = calculateDateStatus(row.original.coolantDate);
        return <div className={cn('capitalize', color)}>{message}</div>;
      },
    },
    {
      accessorKey: 'oilDate',
      header: () => {
        return (
          <Button
            className="px-0 font-bold text-base"
            variant="ghost"
          >
            Aceite
          </Button>
        );
      },
      cell: ({ row }) => {
        const {message, color} = calculateDateStatus(row.original.oilDate);
        return <div className={cn('capitalize', color)}>{message}</div>;
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
      cell: ({ row }: { row: Row<IAsset> }) => {
        const options = [];

        if (user.access?.admin || user.access?.receptionist) {
          options.push({
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
          })
        }
        if (user?.access?.admin) {
          options.push({
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
            {
              content: (
                <Button
                  className="w-full flex justify-start items-center gap-2 text-primary"
                  variant="outline"
                  onClick={() => handleLogsClick(`${row.original.id}`)}
                >
                  <NotebookPen className="text-primary h-5" />
                  Registros
                </Button>
              ),
              key: `logs ${row?.original?.id}`,
            } )
        }

        options.push({
          content: (
            <Button
              className="w-full flex justify-start items-center gap-2 text-primary"
              variant="outline"
              type="button"
              onClick={() => handleAction('checks', row?.original?.id)}
            >
              <ScanEye /> Agregar revisión
            </Button>
          ),
          key: `carCheck ${row?.original?.id}`,
        })

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

  return <>
    <CarChecks id={id} open={openCarChecks} setOpen={setOpenCarChecks} />
    <DeleteAsset id={id} open={openDelete} setOpen={setOpenDelete} />
    <EditAsset id={id} open={openEdit} setOpen={setOpenEdit} />
    <DataTable data={data} columns={columns} />
  </>;
};
