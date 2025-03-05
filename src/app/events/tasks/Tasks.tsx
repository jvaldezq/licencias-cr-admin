import { CreateTask } from '@/app/events/tasks/CreateTask';
import { ITask, IUser } from '@/lib/definitions';
import { DataTable } from '@/components/Table';
import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import dayjs from 'dayjs';

interface Props {
  user: IUser;
  locationId?: string;
  tasks?: ITask[];
}

export const Tasks = (props: Props) => {
  const { user, locationId, tasks } = props;
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
      accessorKey: 'date',
      header: () => {
        return (
          <Button className="px-0 font-bold text-base" variant="ghost">
            Fecha
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize">
          {dayjs(row.original.date).format('YYYY-MM-DD')}
        </div>
      ),
    },
  ];

  return (
    <section className="flex flex-col">
      <CreateTask user={user} locationId={locationId} />
      <DataTable data={tasks || []} columns={columns} />
    </section>
  );
};
