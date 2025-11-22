'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Eye } from 'lucide-react';
import { useGetManualsList, useDeleteManualMutation } from '../services/client';
import { ManualStatus, IManual } from '@/lib/definitions';
import { toast } from 'sonner';
import { format } from 'date-fns';

const statusColors = {
  [ManualStatus.DRAFT]: 'bg-yellow-100 text-yellow-800',
  [ManualStatus.PUBLISHED]: 'bg-green-100 text-green-800',
  [ManualStatus.ARCHIVED]: 'bg-gray-100 text-gray-800',
};

const statusLabels = {
  [ManualStatus.DRAFT]: 'Borrador',
  [ManualStatus.PUBLISHED]: 'Publicado',
  [ManualStatus.ARCHIVED]: 'Archivado',
};

export function ManualsTable() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const { data: manuals, isLoading } = useGetManualsList({ searchTerm });
  const deleteMutation = useDeleteManualMutation();

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este manual?')) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(id);
      toast.success('Manual eliminado exitosamente');
      router.refresh();
    } catch (error) {
      toast.error('Error al eliminar el manual');
      console.error(error);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Cargando...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Buscar manuales..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border rounded-lg w-64"
        />
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Capítulos</TableHead>
              <TableHead>Fecha de Creación</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {manuals?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  No se encontraron manuales
                </TableCell>
              </TableRow>
            ) : (
              manuals?.map((manual: IManual & { chapters?: { id: string }[] }) => (
                <TableRow key={manual.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div>{manual.title}</div>
                      {manual.description && (
                        <div className="text-sm text-gray-500 mt-1">
                          {manual.description}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[manual.status as ManualStatus]}>
                      {statusLabels[manual.status as ManualStatus]}
                    </Badge>
                  </TableCell>
                  <TableCell>{manual.chapters?.length || 0}</TableCell>
                  <TableCell>
                    {format(new Date(manual.createdAt), 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/admin/assessments/${manual.id}`)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(manual.id)}
                        disabled={deleteMutation.isLoading}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
