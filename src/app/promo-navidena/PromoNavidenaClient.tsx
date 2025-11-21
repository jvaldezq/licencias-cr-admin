'use client';

import * as React from 'react';
import { useState } from 'react';
import * as XLSX from 'xlsx';
import dayjs from 'dayjs';
import { PromoTable } from './PromoTable';
import { PromoParticipant } from './services/server';
import { RaffleModal } from './RaffleModal';
import { clientApi } from '@/lib/clientApi';
import toast from 'react-hot-toast';

interface Props {
  initialData: PromoParticipant[];
}

interface Winner {
  id: string;
  customerName: string;
  customerPhone: string;
  assetName: string;
}

export const PromoNavidenaClient = ({ initialData }: Props) => {
  const [raffleModalOpen, setRaffleModalOpen] = useState(false);

  const handleExportExcel = () => {
    // Prepare data for Excel
    const excelData = initialData.map((participant) => ({
      Cliente: participant.customerName,
      Vehículo: participant.assetName,
      Fecha: participant.eventDate
        ? dayjs(participant.eventDate).format('DD/MM/YYYY')
        : 'N/A',
    }));

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Participantes');

    // Generate filename with current date
    const filename = `promo-navidena-${dayjs().format('YYYY-MM-DD')}.xlsx`;

    // Trigger download
    XLSX.writeFile(workbook, filename);
    toast.success('Archivo Excel descargado exitosamente');
  };

  const handleGenerateRaffle = () => {
    if (initialData.length === 0) {
      toast.error('No hay participantes para el sorteo');
      return;
    }
    setRaffleModalOpen(true);
  };

  const handleGenerateWinner = async (): Promise<Winner> => {
    try {
      const response = await clientApi.post('/promo-raffle');
      return response.data;
    } catch (error) {
      console.error('Error generating winner:', error);
      throw error;
    }
  };

  // Get participant names for animation
  const participantNames = initialData.map((p) => p.customerName);

  return (
    <>
      <PromoTable
        data={initialData}
        onExportExcel={handleExportExcel}
        onGenerateRaffle={handleGenerateRaffle}
      />
      <RaffleModal
        open={raffleModalOpen}
        onOpenChange={setRaffleModalOpen}
        participants={participantNames}
        onGenerateWinner={handleGenerateWinner}
      />
    </>
  );
};
