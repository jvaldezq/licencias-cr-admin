'use client';

import { ColumnDef, Row } from '@tanstack/react-table';
import { IEvent, IUser } from '@/lib/definitions';
import { Button } from '@/components/ui/button';
import * as React from 'react';
import { DataTable } from '@/components/Table';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import { EditEvent } from '@/app/events/forms/EditEvent';
import { DeleteEvent } from '@/app/events/forms/DeleteEvent';
import { PaymentEvent } from '@/app/events/forms/PaymentEvent';
import { ViewEvent } from '@/app/events/forms/ViewEvent';
import { useCallback, useState } from 'react';
import { ViewIcon } from '@/assets/icons/ViewIcon';
import { EditIcon } from '@/assets/icons/EditIcon';
import { DeleteIcon } from '@/assets/icons/DeleteIcon';
import { MoneyIcon } from '@/assets/icons/MoneyIcon';
import { Dropdown } from '@/components/Dropdown';
import { List } from 'lucide-react';

dayjs.extend(advancedFormat);

interface Props {
  filters: string;
  data: IEvent[];
  user: IUser;
}

export const ReferredTable = (props: Props) => {
  const { data, user, filters } = props;
  const [openView, setOpenView] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openPayment, setOpenPayment] = useState(false);
  const [id, setId] = useState('');

  const handleAction = useCallback((action: string, id: string) => {
    if (action === 'view') {
      setOpenView(true);
    }
    if (action === 'edit') {
      setOpenEdit(true);
    }
    if (action === 'delete') {
      setOpenDelete(true);
    }
    if (action === 'payment') {
      setOpenPayment(true);
    }

    setId(id);
  }, []);

  const allowActions = user?.access?.receptionist || user?.access?.admin;

  const columns: ColumnDef<IEvent>[] = [
    {
      accessorKey: 'customer.schedule.startDate',
      header: () => {
        return (
          <Button className="px-0 font-bold text-base" variant="ghost">
            Inicio
          </Button>
        );
      },
      cell: ({ row }: { row: Row<IEvent> }) => {
        const [startTime, endTime] =
          row?.original?.customer?.schedule?.startTime?.split(':') || [];
        return (
          <div className="capitalize">
            {dayjs()
              .set('hour', +startTime)
              .set('minute', +endTime)
              .format('hh:mm A')}
          </div>
        );
      },
    },
    {
      accessorKey: 'customer.schedule.endDate',
      header: () => {
        return (
          <Button className="px-0 font-bold text-base" variant="ghost">
            Fin
          </Button>
        );
      },
      cell: ({ row }: { row: Row<IEvent> }) => {
        const [startTime, endTime] =
          row?.original?.customer?.schedule?.endTime?.split(':') || [];
        return (
          <div className="capitalize">
            {dayjs()
              .set('hour', +startTime)
              .set('minute', +endTime)
              .format('hh:mm A')}
          </div>
        );
      },
    },
    {
      accessorKey: 'asset.name',
      header: () => {
        return (
          <Button className="px-0 font-bold text-base" variant="ghost">
            Vehículo
          </Button>
        );
      },
      cell: ({ row }: { row: Row<IEvent> }) => {
        const name = row?.original?.asset?.name || 'Sin asignar';
        const color = row?.original?.licenseType?.color || '#d3d3d3';
        const licenseType = row?.original?.licenseType?.name
          ? `(${row?.original?.licenseType?.name})`
          : undefined;
        return (
          <div
            className={`flex flex-col gap-2 ${!row?.original?.asset?.name ? 'text-error font-bold' : ''}`}
          >
            <p className="flex gap-2">
              <span
                className="h-4 w-4 rounded-full"
                style={{ backgroundColor: color }}
              />
              {`${licenseType} ${name}`}
            </p>
            {row?.original?.asset?.locationId !==
              JSON.parse(atob(filters)).locationId &&
              row?.original?.asset?.name !== undefined && (
                <p className="text-error font-bold text-xs">
                  Vehículo fuera de sede
                </p>
              )}
          </div>
        );
      },
    },
    {
      accessorKey: 'location.name',
      header: () => {
        return (
          <Button className="px-0 font-bold text-base" variant="ghost">
            Sede
          </Button>
        );
      },
      cell: ({ row }: { row: Row<IEvent> }) => {
        const name = row?.original?.location?.name;
        return <div className="capitalize">{name}</div>;
      },
    },
    {
      accessorKey: 'customer.name',
      header: () => {
        return (
          <Button className="px-0 font-bold text-base" variant="ghost">
            Cliente
          </Button>
        );
      },
      cell: ({ row }: { row: Row<IEvent> }) => {
        const name = row?.original?.customer?.name;
        return <div className="capitalize">{name}</div>;
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
      cell: ({ row }: { row: Row<IEvent> }) => {
        const options = [
          {
            content: (
              <Button
                onClick={() => handleAction('view', row?.original?.id)}
                className="w-full flex justify-start items-center gap-2 text-primary"
                variant="outline"
              >
                <ViewIcon /> Ver
              </Button>
            ),
            key: `view ${row?.original?.id}`,
          },
          {
            content: (
              <Button
                onClick={() => handleAction('edit', row?.original?.id)}
                className="w-full flex justify-start items-center gap-2 text-primary"
                variant="outline"
              >
                <EditIcon /> Editar
              </Button>
            ),
            key: `edit ${row?.original?.id}`,
          },
          {
            content: (
              <Button
                onClick={() => handleAction('delete', row?.original?.id)}
                className="w-full flex justify-start items-center gap-2 text-secondary"
                variant="outline"
              >
                <DeleteIcon /> Eliminar
              </Button>
            ),
            key: `delete ${row?.original?.id}`,
          },
        ];

        const price = row?.original?.payment?.price || 0;
        const cashAdvance = row?.original?.payment?.cashAdvance || 0;
        const hasPaid = !(price - cashAdvance > 0);

        if (!hasPaid) {
          options.push({
            content: (
              <Button
                onClick={() => handleAction('payment', row?.original?.id)}
                className="w-full flex justify-start items-center gap-2 text-success"
                variant="outline"
              >
                <MoneyIcon /> Abono/Pago
              </Button>
            ),
            key: `complete ${row?.original?.id}`,
          });
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
  ].filter((column) => (allowActions ? true : column.id !== 'actions'));

  const mobileColumns: ColumnDef<IEvent>[] = [
    {
      accessorKey: 'customer.schedule.startDate',
      header: () => {
        return (
          <Button className="px-0 font-bold text-base" variant="ghost">
            Información
          </Button>
        );
      },
      cell: ({ row }: { row: Row<IEvent> }) => {
        const clientName = row?.original?.customer?.name;
        const instructorName = row?.original?.instructor?.name || 'Sin asignar';
        const assetName = row?.original?.asset?.name || 'Sin asignar';
        const assetColor = row?.original?.licenseType?.color || '#d3d3d3';
        const licenseType = row?.original?.licenseType?.name
          ? `(${row?.original?.licenseType?.name})`
          : undefined;
        if (row?.original?.type?.name?.includes('Clase')) {
          const [startTimeEnding, endTimeEnding] =
            row?.original?.customer?.schedule?.endTime?.split(':') || [];
          const [startTime, endTime] =
            row?.original?.customer?.schedule?.startTime?.split(':') || [];

          return (
            <div className="flex flex-col gap-3">
              <p>
                <strong>Inicio: </strong>
                {dayjs()
                  .set('hour', +startTime)
                  .set('minute', +endTime)
                  .format('hh:mm A')}
              </p>
              <p>
                <strong>Fin: </strong>
                {dayjs()
                  .set('hour', +startTimeEnding)
                  .set('minute', +endTimeEnding)
                  .format('hh:mm A')}
              </p>
              <p>
                <strong>Cliente:</strong> {clientName}
              </p>
              <p>
                <strong>Instructor:</strong> {instructorName}
              </p>
              <p
                className={`capitalize flex gap-2 items-center ${!row?.original?.asset?.name ? 'text-error font-bold' : ''}`}
              >
                <span
                  className="h-4 w-4 rounded-full"
                  style={{ backgroundColor: assetColor }}
                />
                {`${licenseType} ${assetName}`}
              </p>
            </div>
          );
        }
        const [startTimeEnding, endTimeEnding] =
          row?.original?.time?.split(':') || [];
        const [startTime, endTime] =
          row?.original?.customer?.schedule?.startTime?.split(':') || [];
        return (
          <div className="flex flex-col gap-3">
            <p>
              <strong>Hora cliente: </strong>
              {dayjs()
                .set('hour', +startTime)
                .set('minute', +endTime)
                .format('hh:mm A')}
            </p>
            <p>
              <strong>Hora prueba: </strong>
              <span className="text-secondary font-bold">
                {dayjs()
                  .set('hour', +startTimeEnding)
                  .set('minute', +endTimeEnding)
                  .format('hh:mm A')}
              </span>
            </p>
            <p>
              <strong>Cliente:</strong> {clientName}
            </p>
            <p>
              <strong>Instructor:</strong> {instructorName}
            </p>
            <p
              className={`capitalize flex gap-2 items-center ${!row?.original?.asset?.name ? 'text-error font-bold' : ''}`}
            >
              <span
                className="h-4 w-4 rounded-full"
                style={{ backgroundColor: assetColor }}
              />
              {`${licenseType} ${assetName}`}
            </p>
          </div>
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
      cell: ({ row }: { row: Row<IEvent> }) => {
        const options = [
          {
            content: (
              <Button
                onClick={() => handleAction('view', row?.original?.id)}
                className="w-full flex justify-start items-center gap-2 text-primary"
                variant="outline"
              >
                <ViewIcon /> Ver
              </Button>
            ),
            key: `view ${row?.original?.id}`,
          },
          {
            content: (
              <Button
                onClick={() => handleAction('edit', row?.original?.id)}
                className="w-full flex justify-start items-center gap-2 text-primary"
                variant="outline"
              >
                <EditIcon /> Editar
              </Button>
            ),
            key: `edit ${row?.original?.id}`,
          },
          {
            content: (
              <Button
                onClick={() => handleAction('delete', row?.original?.id)}
                className="w-full flex justify-start items-center gap-2 text-secondary"
                variant="outline"
              >
                <DeleteIcon /> Eliminar
              </Button>
            ),
            key: `delete ${row?.original?.id}`,
          },
          {
            content: (
              <Button
                onClick={() => handleAction('payment', row?.original?.id)}
                className="w-full flex justify-start items-center gap-2 text-success"
                variant="outline"
              >
                <MoneyIcon /> Abono/Pago
              </Button>
            ),
            key: `complete ${row?.original?.id}`,
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
  ].filter((column) => (allowActions ? true : column.id !== 'actions'));

  if (!data.length) {
    return null;
  }

  return (
    <div className="my-8">
      <h1 className="text-center py-2 text-lg font-semibold text-warning-yellow bg-secondary rounded-2xl">
        Referidos a otras escuelas
      </h1>
      <ViewEvent id={id} open={openView} setOpen={setOpenView} />
      <EditEvent id={id} user={user} open={openEdit} setOpen={setOpenEdit} />
      <DeleteEvent id={id} open={openDelete} setOpen={setOpenDelete} />
      <PaymentEvent
        id={id}
        user={user}
        open={openPayment}
        setOpen={setOpenPayment}
      />
      <div className="block md:hidden">
        <DataTable data={data} columns={mobileColumns} />
      </div>
      <div className="hidden md:block">
        <DataTable data={data} columns={columns} />
      </div>
    </div>
  );
};
