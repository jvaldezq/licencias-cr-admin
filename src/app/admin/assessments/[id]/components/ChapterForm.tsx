'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateChapterMutation, useUpdateChapterMutation } from '../../services/client';
import { IChapterForm } from '@/lib/definitions';
import { toast } from 'sonner';

interface ChapterFormProps {
  manualId: string;
  chapter?: IChapterForm & { id: string };
  onSuccess?: () => void;
}

export function ChapterForm({ manualId, chapter, onSuccess }: ChapterFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(chapter?.title || '');

  const createMutation = useCreateChapterMutation();
  const updateMutation = useUpdateChapterMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (chapter?.id) {
        await updateMutation.mutateAsync({
          id: chapter.id,
          manualId,
          title,
        });
        toast.success('Capítulo actualizado exitosamente');
      } else {
        const newChapter = await createMutation.mutateAsync({
          manualId,
          title,
          content: '',
        });
        toast.success('Capítulo creado exitosamente');
        router.push(`/admin/assessments/${manualId}/chapters/${newChapter.id}`);
      }
      router.refresh();
      onSuccess?.();
    } catch (error) {
      toast.error('Error al guardar el capítulo');
      console.error(error);
    }
  };

  const isLoading = createMutation.isLoading || updateMutation.isLoading;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Título del Capítulo *</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Nombre del capítulo"
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Guardando...' : chapter ? 'Actualizar' : 'Crear y Editar'}
        </Button>
      </div>
    </form>
  );
}
