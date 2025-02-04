'use client';

import { ColumnDef, Row } from '@tanstack/react-table';
import {
  CLASS_TYPE,
  EventStatus,
  IEvent,
  IUser,
  OWNCAR,
} from '@/lib/definitions';
import { Button } from '@/components/ui/button';
import * as React from 'react';
import { DataTable } from '@/components/Table';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import { useCallback, useState } from 'react';
import { EditEvent } from '@/app/events/forms/EditEvent';
import { DeleteEvent } from '@/app/events/forms/DeleteEvent';
import { PaymentEvent } from '@/app/events/forms/PaymentEvent';
import { Dropdown } from '@/components/Dropdown';
import { ViewEvent } from '@/app/events/forms/ViewEvent';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EventsCalendar } from '@/app/events/eventsTable/EventsCalendar';
import {
  Stethoscope,
  NotebookPen,
  List,
  BadgeCent,
  MessageSquare,
  Frown,
  AlarmClock,
  AlarmCheck,
  CalendarCheck,
  Trash2,
  Eye,
  PenLine,
  HandCoins,
  Award,
} from 'lucide-react';
import { PracticingEvent } from '@/app/events/forms/PracticingEvent';
import { Popover } from '@/components/Popover';
import { getInitials } from '@/lib/getInitials';
import { NoShowEvent } from '@/app/events/forms/NoShowEvent';
import { ConfirmEvent } from '@/app/events/forms/ConfirmEvent';
import { CompleteEvent } from '@/app/events/forms/CompleteEvent';

dayjs.extend(advancedFormat);

interface Props {
  filters: string;
  data: IEvent[];
  user: IUser;
}

export const EventsTable = (props: Props) => {
  const [openView, setOpenView] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openComplete, setOpenComplete] = useState(false);
  const [openPracticing, setOpenPracticing] = useState(false);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [openNoShow, setOpenNoShow] = useState(false);
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
    if (action === 'practicing') {
      setOpenPracticing(true);
    }
    if (action === 'confirmation') {
      setOpenConfirmation(true);
    }
    if (action === 'noShow') {
      setOpenNoShow(true);
    }
    if (action === 'complete') {
      setOpenComplete(true);
    }

    setId(id);
  }, []);

  const { data, user, filters } = props;

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
        const hasBeenContacted = row?.original?.hasBeenContacted;
        return (
          <div className="capitalize flex gap-2 items-center">
            <p>
              {dayjs()
                .set('hour', +startTime)
                .set('minute', +endTime)
                .format('hh:mm A')}
            </p>
            <p>{hasBeenContacted && <AlarmCheck className="h-4 w-4" />}</p>
          </div>
        );
      },
    },
    {
      accessorKey: 'date',
      header: () => {
        return (
          <Button className="px-0 font-bold text-base" variant="ghost">
            Prueba / Fin
          </Button>
        );
      },
      cell: ({ row }: { row: Row<IEvent> }) => {
        if (row?.original?.type?.name?.includes('Clase')) {
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
        }
        const [startTime, endTime] = row?.original?.time?.split(':') || [];
        return (
          <div className="capitalize font-bold border border-solid border-secondary rounded-2xl p-2 text-center text-secondary">
            {dayjs()
              .set('hour', +startTime)
              .set('minute', +endTime)
              .format('hh:mm A')}
          </div>
        );
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
        const name = getInitials(row?.original?.customer?.name);
        const isTestType = row?.original?.typeId === CLASS_TYPE.DRIVE_TEST;
        const isCompleted = row?.original?.status?.includes(
          EventStatus.COMPLETED,
        );
        const testPassed = row?.original?.customer.testPassed;
        const awardText = isCompleted
          ? testPassed
            ? 'Aprobó'
            : 'Reprobó'
          : 'Pendiente';
        const awardColor = isCompleted
          ? testPassed
            ? 'text-success'
            : 'text-error'
          : 'text-gray-500';
        return (
          <div className="capitalize flex gap-2 items-center">
            <p>{name}</p>
            <div className="flex gap-1">
              <p>
                {row?.original?.hasMedical && (
                  <Stethoscope className="h-4 w-4" />
                )}
              </p>
              <p>
                {row?.original?.notes && (
                  <Popover text={row?.original?.notes}>
                    <MessageSquare className="h-4 w-4 cursor-pointer" />
                  </Popover>
                )}
              </p>
              <p>
                {isTestType && (
                  <Popover text={awardText}>
                    <Award className={`h-4 w-4 cursor-pointer ${awardColor}`} />
                  </Popover>
                )}
              </p>
            </div>
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
        return (
          <div
            className={`flex flex-col gap-2 ${!row?.original?.asset?.name ? 'text-error font-bold' : ''}`}
          >
            <div className="flex gap-2 items-center">
              <span
                className="h-3.5 w-5 rounded"
                style={{ backgroundColor: color }}
              />
              <p>{name}</p>
            </div>
            {row?.original?.asset?.locationId !==
              JSON.parse(atob(filters)).locationId &&
              row?.original?.asset?.name !== undefined &&
              row?.original?.asset?.id !== OWNCAR.OWN && (
                <p className="text-error font-bold text-xs">
                  Vehículo fuera de sede
                </p>
              )}
          </div>
        );
      },
    },
    {
      accessorKey: 'instructor.name',
      header: () => {
        return (
          <Button className="px-0 font-bold text-base" variant="ghost">
            Instructor
          </Button>
        );
      },
      cell: ({ row }: { row: Row<IEvent> }) => {
        const name = row?.original?.instructor?.name
          ? getInitials(row?.original?.instructor?.name)
          : 'Sin asignar';
        return (
          <div
            className={`capitalize flex gap-2 items-center ${!row?.original?.instructor?.name ? 'text-error font-bold' : ''}`}
          >
            {name}
          </div>
        );
      },
    },
    {
      accessorKey: 'status',
      header: () => {
        return (
          <Button className="px-0 font-bold text-base" variant="ghost">
            Pagó
          </Button>
        );
      },
      cell: ({ row }: { row: Row<IEvent> }) => {
        const price = row?.original?.payment?.price || 0;
        const cashAdvance = row?.original?.payment?.cashAdvance || 0;
        const hasPaid = !(price - cashAdvance > 0);
        const noShow = row?.original?.noShow;
        return (
          <div className="flex gap-2 items-center">
            {hasPaid ? (
              <BadgeCent className="text-success" />
            ) : noShow ? (
              <Popover text="El cliente no se presentó">
                <BadgeCent className="text-error" />
              </Popover>
            ) : (
              <BadgeCent className="text-gray-500/[0.4]" />
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'locationId',
      header: () => {
        return (
          <Button className="px-0 font-bold text-base" variant="ghost">
            Otra sede
          </Button>
        );
      },
      cell: ({ row }: { row: Row<IEvent> }) => {
        const isOtherLocation =
          row?.original?.location?.id !== JSON.parse(atob(filters)).locationId;
        const isNotOwnAsset = row?.original?.asset?.name !== 'Propio';
        if (isOtherLocation && isNotOwnAsset) {
          return (
            <div className="capitalize font-bold bg-secondary rounded-2xl p-2 text-center text-warning-yellow">
              {row?.original?.location?.name}
            </div>
          );
        }
        return null;
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
        const price = row?.original?.payment?.price || 0;
        const cashAdvance = row?.original?.payment?.cashAdvance || 0;
        const hasBeenContacted = row?.original?.hasBeenContacted;
        const noShow = row?.original?.noShow;
        const hasPaid = !(price - cashAdvance > 0);
        const options = [
          {
            content: (
              <Button
                onClick={() => handleAction('view', row?.original?.id)}
                className="w-full flex justify-start items-center gap-2 text-primary"
                variant="outline"
              >
                <Eye /> Ver
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
                <PenLine /> Editar
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
                <Trash2 /> Eliminar
              </Button>
            ),
            key: `delete ${row?.original?.id}`,
          },
        ];

        if (!row?.original?.status?.includes(EventStatus.COMPLETED)) {
          if (!hasBeenContacted) {
            options.push({
              content: (
                <Button
                  onClick={() =>
                    handleAction('confirmation', row?.original?.id)
                  }
                  className="w-full flex justify-start items-center gap-2 text-blue-500"
                  variant="outline"
                >
                  <AlarmClock /> Confirmar
                </Button>
              ),
              key: `confirmation ${row?.original?.id}`,
            });
          }
          if (!hasPaid) {
            options.push({
              content: (
                <Button
                  onClick={() => handleAction('payment', row?.original?.id)}
                  className="w-full flex justify-start items-center gap-2 text-success"
                  variant="outline"
                >
                  <HandCoins /> Abono/Pago
                </Button>
              ),
              key: `complete ${row?.original?.id}`,
            });
          } else if (
            !row?.original?.status?.includes(EventStatus.PRACTICING) &&
            hasBeenContacted
          ) {
            options.push({
              content: (
                <Button
                  onClick={() => handleAction('practicing', row?.original?.id)}
                  className="w-full flex justify-start items-center gap-2 text-yellow-500"
                  variant="outline"
                >
                  <NotebookPen /> Sale a practicar
                </Button>
              ),
              key: `practicing ${row?.original?.id}`,
            });
          } else if (
            row?.original?.status?.includes(EventStatus.PRACTICING) &&
            hasBeenContacted
          ) {
            options.push({
              content: (
                <Button
                  onClick={() => handleAction('complete', row?.original?.id)}
                  className="w-full flex justify-start items-center gap-2 text-teal-500"
                  variant="outline"
                >
                  <CalendarCheck /> Completar
                </Button>
              ),
              key: `complete ${row?.original?.id}`,
            });
          }
          if (
            !noShow &&
            !row?.original?.status?.includes(EventStatus.PRACTICING) &&
            hasBeenContacted
          ) {
            options.push({
              content: (
                <Button
                  onClick={() => handleAction('noShow', row?.original?.id)}
                  className="w-full flex justify-start items-center gap-2 text-warning"
                  variant="outline"
                >
                  <Frown /> No se presentó
                </Button>
              ),
              key: `noShow ${row?.original?.id}`,
            });
          }
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
        const clientName = getInitials(row?.original?.customer?.name);
        const instructorName = row?.original?.instructor?.name
          ? getInitials(row?.original?.instructor?.name)
          : 'Sin asignar';
        const assetName = row?.original?.asset?.name || 'Sin asignar';
        const eventType = row?.original?.type?.name || '-';
        const assetColor = row?.original?.licenseType?.color || '#d3d3d3';
        const price = row?.original?.payment?.price || 0;
        const cashAdvance = row?.original?.payment?.cashAdvance || 0;
        const hasPaid = !(price - cashAdvance > 0);
        const isOtherLocation =
          row?.original?.location?.id !== JSON.parse(atob(filters)).locationId;
        const isNotOwnAsset = row?.original?.asset?.name !== 'Propio';
        const hasBeenContacted = row?.original?.hasBeenContacted;
        const noShow = row?.original?.noShow;
        const isTestType = row?.original?.typeId === CLASS_TYPE.DRIVE_TEST;
        const isCompleted = row?.original?.status?.includes(
          EventStatus.COMPLETED,
        );
        const testPassed = row?.original?.customer.testPassed;
        const awardText = isCompleted
          ? testPassed
            ? 'Aprobó'
            : 'Reprobó'
          : 'Pendiente';
        const awardColor = isCompleted
          ? testPassed
            ? 'text-success'
            : 'text-error'
          : 'text-gray-500';

        if (row?.original?.type?.name?.includes('Clase')) {
          const [startTimeEnding, endTimeEnding] =
            row?.original?.customer?.schedule?.endTime?.split(':') || [];
          const [startTime, endTime] =
            row?.original?.customer?.schedule?.startTime?.split(':') || [];

          return (
            <div className="flex flex-col gap-3">
              <div className="capitalize flex gap-2 items-center">
                <strong>Inicio: </strong>
                <p>
                  {dayjs()
                    .set('hour', +startTime)
                    .set('minute', +endTime)
                    .format('hh:mm A')}
                </p>
                <p>{hasBeenContacted && <AlarmCheck className="h-4 w-4" />}</p>
              </div>
              <p>
                <strong>Fin: </strong>
                {dayjs()
                  .set('hour', +startTimeEnding)
                  .set('minute', +endTimeEnding)
                  .format('hh:mm A')}
              </p>
              <div className="capitalize flex gap-2 items-center">
                <strong>Cliente:</strong> {clientName}
                <div className="flex gap-1">
                  {row?.original?.hasMedical && (
                    <Stethoscope className="h-4 w-4" />
                  )}
                  {row?.original?.notes && (
                    <Popover text={row?.original?.notes}>
                      <MessageSquare className="h-4 w-4 cursor-pointer" />
                    </Popover>
                  )}
                  {isTestType && (
                    <Popover text={awardText}>
                      <Award
                        className={`h-4 w-4 cursor-pointer ${awardColor}`}
                      />
                    </Popover>
                  )}
                </div>
              </div>
              <p>
                <strong>Instructor:</strong> {instructorName}
              </p>
              <div
                className={`capitalize flex gap-2 items-center ${!row?.original?.asset?.name ? 'text-error font-bold' : ''}`}
              >
                <span
                  className="h-3.5 w-5 rounded"
                  style={{ backgroundColor: assetColor }}
                />
                <p>{assetName}</p>
              </div>
              <div className="flex gap-2 items-center">
                <strong>Pagó:</strong>
                {hasPaid ? (
                  <BadgeCent className="text-success h-5" />
                ) : noShow ? (
                  <Popover text="El cliente no se presentó">
                    <BadgeCent className="text-error" />
                  </Popover>
                ) : (
                  <BadgeCent className="text-gray-500/[0.4] h-5" />
                )}
              </div>
              {isOtherLocation && isNotOwnAsset && (
                <div className="capitalize font-bold bg-secondary rounded-2xl p-2 text-center text-warning-yellow">
                  {row?.original?.location?.name}
                </div>
              )}
            </div>
          );
        }
        const [startTimeEnding, endTimeEnding] =
          row?.original?.time?.split(':') || [];
        const [startTime, endTime] =
          row?.original?.customer?.schedule?.startTime?.split(':') || [];
        return (
          <div className="flex flex-col gap-3">
            <div className="capitalize flex gap-2 items-center">
              <p>
                <strong>Hora cliente: </strong>
                {dayjs()
                  .set('hour', +startTime)
                  .set('minute', +endTime)
                  .format('hh:mm A')}
              </p>
              <p>{hasBeenContacted && <AlarmCheck className="h-4 w-4" />}</p>
            </div>
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
              <strong>Tipo:</strong> {eventType}
            </p>
            <div className="capitalize flex gap-2 items-center">
              <strong>Cliente:</strong> {clientName}
              <div className="flex gap-1">
                {row?.original?.hasMedical && (
                  <Stethoscope className="h-4 w-4" />
                )}
                {row?.original?.notes && (
                  <Popover text={row?.original?.notes}>
                    <MessageSquare className="h-4 w-4 cursor-pointer" />
                  </Popover>
                )}
                {isTestType && (
                  <Popover text={awardText}>
                    <Award className={`h-4 w-4 cursor-pointer ${awardColor}`} />
                  </Popover>
                )}
              </div>
            </div>
            <p>
              <strong>Instructor:</strong> {instructorName}
            </p>
            <div
              className={`capitalize flex gap-2 items-center ${!row?.original?.asset?.name ? 'text-error font-bold' : ''}`}
            >
              <span
                className="h-3.5 w-5 rounded"
                style={{ backgroundColor: assetColor }}
              />
              <p>{assetName}</p>
            </div>
            <div className="flex gap-2 items-center">
              <strong>Pagó:</strong>
              {hasPaid ? (
                <BadgeCent className="text-success h-5" />
              ) : noShow ? (
                <Popover text="El cliente no se presentó">
                  <BadgeCent className="text-error" />
                </Popover>
              ) : (
                <BadgeCent className="text-gray-500/[0.4] h-5" />
              )}
            </div>
            {isOtherLocation && isNotOwnAsset && (
              <div className="capitalize font-bold bg-secondary rounded-2xl p-2 text-center text-warning-yellow">
                {row?.original?.location?.name}
              </div>
            )}
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
        const price = row?.original?.payment?.price || 0;
        const cashAdvance = row?.original?.payment?.cashAdvance || 0;
        const hasPaid = !(price - cashAdvance > 0);
        const hasBeenContacted = row?.original?.hasBeenContacted;
        const noShow = row?.original?.noShow;

        const options = [
          {
            content: (
              <Button
                onClick={() => handleAction('view', row?.original?.id)}
                className="w-full flex justify-start items-center gap-2 text-primary"
                variant="outline"
              >
                <Eye /> Ver
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
                <PenLine /> Editar
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
                <Trash2 /> Eliminar
              </Button>
            ),
            key: `delete ${row?.original?.id}`,
          },
        ];

        if (!row?.original?.status?.includes(EventStatus.COMPLETED)) {
          if (!hasBeenContacted) {
            options.push({
              content: (
                <Button
                  onClick={() =>
                    handleAction('confirmation', row?.original?.id)
                  }
                  className="w-full flex justify-start items-center gap-2 text-blue-500"
                  variant="outline"
                >
                  <AlarmClock /> Confirmar
                </Button>
              ),
              key: `confirmation ${row?.original?.id}`,
            });
          }
          if (!hasPaid) {
            options.push({
              content: (
                <Button
                  onClick={() => handleAction('payment', row?.original?.id)}
                  className="w-full flex justify-start items-center gap-2 text-success"
                  variant="outline"
                >
                  <HandCoins /> Abono/Pago
                </Button>
              ),
              key: `complete ${row?.original?.id}`,
            });
          } else if (
            !row?.original?.status?.includes(EventStatus.PRACTICING) &&
            hasBeenContacted
          ) {
            options.push({
              content: (
                <Button
                  onClick={() => handleAction('practicing', row?.original?.id)}
                  className="w-full flex justify-start items-center gap-2 text-yellow-500"
                  variant="outline"
                >
                  <NotebookPen /> Sale a practicar
                </Button>
              ),
              key: `practicing ${row?.original?.id}`,
            });
          } else if (
            row?.original?.status?.includes(EventStatus.PRACTICING) &&
            hasBeenContacted
          ) {
            options.push({
              content: (
                <Button
                  onClick={() => handleAction('complete', row?.original?.id)}
                  className="w-full flex justify-start items-center gap-2 text-teal-500"
                  variant="outline"
                >
                  <CalendarCheck /> Completar
                </Button>
              ),
              key: `complete ${row?.original?.id}`,
            });
          }
          if (
            !noShow &&
            !row?.original?.status?.includes(EventStatus.PRACTICING) &&
            hasBeenContacted
          ) {
            options.push({
              content: (
                <Button
                  onClick={() => handleAction('noShow', row?.original?.id)}
                  className="w-full flex justify-start items-center gap-2 text-warning"
                  variant="outline"
                >
                  <Frown /> No se presentó
                </Button>
              ),
              key: `noShow ${row?.original?.id}`,
            });
          }
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

  return (
    <div className="my-8">
      <ViewEvent id={id} open={openView} setOpen={setOpenView} user={user} />
      <EditEvent id={id} user={user} open={openEdit} setOpen={setOpenEdit} />
      <DeleteEvent id={id} open={openDelete} setOpen={setOpenDelete} />
      <CompleteEvent id={id} open={openComplete} setOpen={setOpenComplete} />
      <PracticingEvent
        id={id}
        open={openPracticing}
        setOpen={setOpenPracticing}
      />
      <NoShowEvent id={id} open={openNoShow} setOpen={setOpenNoShow} />
      <ConfirmEvent
        id={id}
        open={openConfirmation}
        setOpen={setOpenConfirmation}
      />
      <PaymentEvent
        id={id}
        user={user}
        open={openPayment}
        setOpen={setOpenPayment}
      />

      <Tabs defaultValue="table">
        <TabsList>
          <TabsTrigger value="table">Citas</TabsTrigger>
          <TabsTrigger value="calendar">Calendario</TabsTrigger>
        </TabsList>
        <TabsContent value="table">
          <div className="block md:hidden">
            <DataTable data={data} columns={mobileColumns} />
          </div>
          <div className="hidden md:block">
            <DataTable data={data} columns={columns} />
          </div>
        </TabsContent>
        <TabsContent value="calendar">
          <EventsCalendar {...props} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
