import { CreateTask } from '@/app/events/tasks/CreateTask';
import { ITask, IUser } from '@/lib/definitions';
import { DataTable } from '@/components/Table';
import * as React from 'react';
import { ColumnDef, Row } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import dayjs from 'dayjs';
import { BookmarkCheck, List, PenLine, Eye } from 'lucide-react';
import { Dropdown } from '@/components/Dropdown';
import { useCallback, useState } from 'react';
import { EditTask } from '@/app/events/tasks/EditTask';
import { ViewTask } from '@/app/events/tasks/ViewTask';
import { TaskComplete } from '@/app/events/tasks/TaskComplete';

interface Props {
  user: IUser;
  locationId?: string;
  tasks?: ITask[];
}

export const Tasks = (props: Props) => {
  const { user, locationId, tasks } = props;
  const [openView, setOpenView] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openComplete, setOpenComplete] = useState(false);
  const [id, setId] = useState('');

  const handleAction = useCallback((action: string, id: string) => {
    if (action === 'view') {
      setOpenView(true);
    }
    if (action === 'edit') {
      setOpenEdit(true);
    }
    if (action === 'complete') {
      setOpenComplete(true);
    }

    setId(id);
  }, []);

  const columns: ColumnDef<ITask>[] = [
    {
      accessorKey: 'title',
      header: () => {
        return (
          <Button className="px-0 font-bold text-base" variant="ghost">
            Título
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('title')}</div>
      ),
    },
    {
      accessorKey: 'notes',
      header: () => {
        return (
          <Button className="px-0 font-bold text-base" variant="ghost">
            Notas
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('notes')}</div>
      ),
    },
    {
      accessorKey: 'assignedTo',
      header: () => {
        return (
          <Button className="px-0 font-bold text-base" variant="ghost">
            Asignado a
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize">{row?.original?.assignedTo?.name}</div>
      ),
    },
    {
      accessorKey: 'date',
      header: () => {
        return (
          <Button className="px-0 font-bold text-base" variant="ghost">
            Fecha
          </Button>
        );
      },
      cell: ({ row }) => {
        const isOlder = dayjs(row.original.date)
          .startOf('day')
          .isBefore(dayjs().startOf('day'));
        return (
          <div
            className={`capitalize ${isOlder ? 'text-error font-semibold' : 'text-success'}`}
          >
            {dayjs(row.original.date).format('YYYY-MM-DD')}
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
      cell: ({ row }: { row: Row<ITask> }) => {
        const options = [];
        const isAdminOrReceptionist =
          user?.access?.admin || user?.access?.receptionist;

        if (isAdminOrReceptionist) {
          options.push({
            content: (
              <Button
                onClick={() => handleAction('complete', row?.original?.id)}
                className="w-full flex justify-start items-center gap-2 text-primary"
                variant="outline"
              >
                <BookmarkCheck /> Completar
              </Button>
            ),
            key: `view ${row?.original?.id}`,
          });

          options.push({
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
          });
        }

        options.push({
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
        });

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
    <section className="flex flex-col">
      <CreateTask user={user} locationId={locationId} />
      <DataTable data={tasks || []} columns={columns} />
      <TaskComplete id={id} open={openComplete} setOpen={setOpenComplete} />
      <ViewTask id={id} open={openView} setOpen={setOpenView} />
      <EditTask id={id} user={user} open={openEdit} setOpen={setOpenEdit} />
    </section>
  );
};
