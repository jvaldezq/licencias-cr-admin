'use client';

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
import { Edit, Trash2, GripVertical } from 'lucide-react';
import { useDeleteChapterMutation } from '../../services/client';
import { IChapter } from '@/lib/definitions';
import { toast } from 'sonner';

interface ChaptersTableProps {
  manualId: string;
  chapters: IChapter[];
}

export function ChaptersTable({ manualId, chapters }: ChaptersTableProps) {
  const router = useRouter();
  const deleteMutation = useDeleteChapterMutation();

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este capítulo?')) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(id);
      toast.success('Capítulo eliminado exitosamente');
      router.refresh();
    } catch (error) {
      toast.error('Error al eliminar el capítulo');
      console.error(error);
    }
  };

  const sortedChapters = [...chapters].sort((a, b) => a.order - b.order);

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12"></TableHead>
            <TableHead>Orden</TableHead>
            <TableHead>Título</TableHead>
            <TableHead>Preguntas</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedChapters.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                No hay capítulos. Crea uno para comenzar.
              </TableCell>
            </TableRow>
          ) : (
            sortedChapters.map((chapter) => (
              <TableRow key={chapter.id}>
                <TableCell>
                  <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                </TableCell>
                <TableCell>{chapter.order}</TableCell>
                <TableCell className="font-medium">{chapter.title}</TableCell>
                <TableCell>{chapter.questions?.length || 0}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        router.push(`/admin/assessments/${manualId}/chapters/${chapter.id}`)
                      }
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(chapter.id)}
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
  );
}
