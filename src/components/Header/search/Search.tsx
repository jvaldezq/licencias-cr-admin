'use client';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/Dialog';
import {
  Search,
  ArchiveX,
  AlarmCheck,
  Stethoscope,
  MessageSquare,
  Award,
  BadgeCent,
  Eye,
  PenLine,
  Trash2,
  AlarmClock,
  HandCoins,
  NotebookPen,
  CalendarCheck,
  Frown,
  List,
} from 'lucide-react';
import * as React from 'react';
import { Field, FormSpy, Form, SupportedInputs } from 'react-final-form';
import { FormInput } from '@/components/Forms/Input/FormInput';
import { useCallback, useState } from 'react';
import { debounce } from 'lodash';
import { useGetSearchEvents } from '@/components/Header/search/services/getSearchEvents';
import { DataTable } from '@/components/Table';
import { TableSkeleton } from '@/components/TableSkeleton';
import { ColumnDef, Row } from '@tanstack/react-table';
import { CLASS_TYPE, EventStatus, IEvent, IUser } from '@/lib/definitions';
import dayjs from 'dayjs';
import { getInitials } from '@/lib/getInitials';
import { Popover } from '@/components/Popover';
import { Dropdown } from '@/components/Dropdown';
import { ViewEvent } from '@/app/events/forms/ViewEvent';
import { EditEvent } from '@/app/events/forms/EditEvent';
import { DeleteEvent } from '@/app/events/forms/DeleteEvent';
import { CompleteEvent } from '@/app/events/forms/CompleteEvent';
import { PracticingEvent } from '@/app/events/forms/PracticingEvent';
import { NoShowEvent } from '@/app/events/forms/NoShowEvent';
import { ConfirmEvent } from '@/app/events/forms/ConfirmEvent';
import { PaymentEvent } from '@/app/events/forms/PaymentEvent';

interface Props {
  user: IUser;
}

interface SearchFormProps {
  search: string;
}

export const SearchWrapper = (props: Props) => {
  const { user } = props;
  const path = usePathname();

  if (path !== '/events') {
    return null;
  }

  return (
    <Dialog
      trigger={
        <Button className="bg-primary/[0.1] flex gap-2 text-white rounded-3xl animate-flip-up animate-duration-1000 md:w-1/2">
          <Search className="h-4" />
          Buscador general
        </Button>
      }
      className="max-w-screen-xl"
    >
      <SearchDialog user={user} />
    </Dialog>
  );
};

const SearchDialog = (props: Props) => {
  const { user } = props;
  const [search, setSearch] = useState('');
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
  const { data, isLoading } = useGetSearchEvents(search);

  const debouncedSubmit = useCallback(
    debounce((values: SearchFormProps) => {
      setSearch(values?.search);
    }, 500),
    [setSearch],
  );
  const allowActions = user?.access?.receptionist || user?.access?.admin;

  const columns: ColumnDef<IEvent>[] = [
    {
      accessorKey: 'date',
      header: () => {
        return (
          <Button className="px-0 font-bold text-base" variant="ghost">
            Fecha
          </Button>
        );
      },
      cell: ({ row }: { row: Row<IEvent> }) => {
        const date = row?.original?.date;
        const hasBeenContacted = row?.original?.hasBeenContacted;
        return (
          <div className="capitalize flex gap-2 items-center">
            <p>{dayjs(date).format('YYYY MMM DD')}</p>
            <p>{hasBeenContacted && <AlarmCheck className="h-4 w-4" />}</p>
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
      accessorKey: 'customer.identification',
      header: () => {
        return (
          <Button className="px-0 font-bold text-base" variant="ghost">
            Identificación
          </Button>
        );
      },
      cell: ({ row }: { row: Row<IEvent> }) => {
        const identification = row?.original?.customer?.identification;
        return (
          <div className="capitalize flex gap-2 items-center">
            <p>{identification}</p>
          </div>
        );
      },
    },
    {
      accessorKey: 'customer.phone',
      header: () => {
        return (
          <Button className="px-0 font-bold text-base" variant="ghost">
            Teléfono
          </Button>
        );
      },
      cell: ({ row }: { row: Row<IEvent> }) => {
        const phone = row?.original?.customer?.phone;
        return (
          <div className="capitalize flex gap-2 items-center">
            <p>{phone}</p>
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
        const date = row?.original?.date;
        const identification = row?.original?.customer?.identification;
        const phone = row?.original?.customer?.phone;
        const price = row?.original?.payment?.price || 0;
        const cashAdvance = row?.original?.payment?.cashAdvance || 0;
        const hasPaid = !(price - cashAdvance > 0);
        const noShow = row?.original?.noShow;

        const clientName = getInitials(row?.original?.customer?.name);
        const hasBeenContacted = row?.original?.hasBeenContacted;
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
          <div className="flex flex-col gap-3">
            <div className="capitalize flex gap-2 items-center">
              <p>
                <strong>Fecha: </strong>
                {dayjs(date).format('YYYY MMM DD')}
              </p>
              <p>{hasBeenContacted && <AlarmCheck className="h-4 w-4" />}</p>
            </div>
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
              <strong>Identificación:</strong> {identification}
            </p>
            <p>
              <strong>Teléfono:</strong> {phone}
            </p>
            <div className="capitalize flex gap-2 items-center">
              <strong>Pagó:</strong>
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
            </div>
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
    <section>
      <Form onSubmit={debouncedSubmit} subscription={{ values: true }}>
        {() => (
          <>
            <Field
              name="search"
              component={FormInput as unknown as SupportedInputs}
              placeholder="Nombre, Cédula, Telefono, Notas"
              label="Buscador general"
              autoFocus={true}
            />
            <FormSpy
              subscription={{ values: true }}
              onChange={({ values }) =>
                debouncedSubmit(values as SearchFormProps)
              }
            />
          </>
        )}
      </Form>
      {((data && data.length === 0) || !data) && !isLoading && (
        <div className="h-96 col-span-full flex flex-col gap-4 text-primary justify-center items-center">
          <ArchiveX />
          <p>No hay resultados</p>
        </div>
      )}
      {isLoading && (
        <div className="h-96 col-span-full flex flex-col gap-4 text-primary justify-center items-center">
          <TableSkeleton />
        </div>
      )}
      {data && data.length > 0 && !isLoading && (
        <>
          <div className="block md:hidden">
            <DataTable data={data} columns={mobileColumns} />
          </div>
          <div className="hidden md:block">
            <DataTable data={data} columns={columns} />
          </div>
        </>
      )}

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
    </section>
  );
};
