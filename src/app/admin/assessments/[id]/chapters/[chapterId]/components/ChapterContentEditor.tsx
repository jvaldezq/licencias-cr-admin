'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TiptapEditor } from '@/components/TiptapEditor';
import { useUpdateChapterMutation } from '../../../../services/client';
import { IChapter } from '@/lib/definitions';
import { toast } from 'sonner';
import { Save } from 'lucide-react';

interface ChapterContentEditorProps {
  chapter: IChapter;
}

export function ChapterContentEditor({ chapter }: ChapterContentEditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState(chapter.title);
  const [content, setContent] = useState(chapter.content || '');
  const [hasChanges, setHasChanges] = useState(false);

  const updateMutation = useUpdateChapterMutation();

  useEffect(() => {
    const hasChanged =
      title !== chapter.title || content !== (chapter.content || '');
    setHasChanges(hasChanged);
  }, [title, content, chapter]);

  const handleSave = async () => {
    try {
      await updateMutation.mutateAsync({
        id: chapter.id,
        manualId: chapter.manualId,
        title,
        content,
      });
      toast.success('Capítulo guardado exitosamente');
      router.refresh();
      setHasChanges(false);
    } catch (error) {
      toast.error('Error al guardar el capítulo');
      console.error(error);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Título del Capítulo</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Título del capítulo"
        />
      </div>

      <div>
        <Label>Contenido</Label>
        <TiptapEditor
          content={content}
          onChange={setContent}
          placeholder="Escribe el contenido del capítulo aquí..."
          minHeight="400px"
        />
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={!hasChanges || updateMutation.isLoading}
        >
          <Save className="w-4 h-4 mr-2" />
          {updateMutation.isLoading ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </div>

      {hasChanges && (
        <p className="text-sm text-yellow-600">
          Tienes cambios sin guardar
        </p>
      )}
    </div>
  );
}
