'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import * as React from 'react';
import { DataTable } from '@/components/Table';
import dayjs from 'dayjs';

interface PromoParticipant {
  id: string;
  customerName: string;
  customerPhone: string;
  assetName: string;
  eventDate: Date | null;
}

interface Props {
  data: PromoParticipant[];
  onExportExcel: () => void;
  onGenerateRaffle: () => void;
}

export const PromoTable = (props: Props) => {
  const { data, onExportExcel, onGenerateRaffle } = props;

  const columns: ColumnDef<PromoParticipant>[] = [
    {
      accessorKey: 'customerName',
      header: () => {
        return (
          <Button className="px-0 font-bold text-base" variant="ghost">
            Cliente
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('customerName')}</div>
      ),
    },
    {
      accessorKey: 'assetName',
      header: () => {
        return (
          <Button className="px-0 font-bold text-base" variant="ghost">
            Vehículo
          </Button>
        );
      },
      cell: ({ row }) => <div>{row.getValue('assetName')}</div>,
    },
    {
      accessorKey: 'eventDate',
      header: () => {
        return (
          <Button className="px-0 font-bold text-base" variant="ghost">
            Fecha
          </Button>
        );
      },
      cell: ({ row }) => {
        const date = row.getValue('eventDate') as Date;
        return (
          <div>{date ? dayjs(date).format('DD/MM/YYYY') : 'N/A'}</div>
        );
      },
    },
  ];

  return (
    <div>
      <div className="flex justify-end gap-4 mb-4">
        <Button
          onClick={onExportExcel}
          variant="outline"
          className="bg-green-600 text-white hover:bg-green-700"
        >
          Exportar a Excel
        </Button>
        <Button
          onClick={onGenerateRaffle}
          className="bg-amber-600 text-white hover:bg-amber-700"
        >
          Generar Sorteo
        </Button>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
};
