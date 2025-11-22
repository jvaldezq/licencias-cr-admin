'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Edit, Plus, ArrowLeft } from 'lucide-react';
import { IManual, ManualStatus } from '@/lib/definitions';
import { ManualForm } from '../../components/ManualForm';
import { ChapterForm } from './ChapterForm';

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

interface ManualHeaderProps {
  manual: IManual;
}

export function ManualHeader({ manual }: ManualHeaderProps) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [createChapterOpen, setCreateChapterOpen] = useState(false);

  return (
    <div>
      <Button
        variant="ghost"
        onClick={() => router.push('/admin/assessments')}
        className="mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver a Manuales
      </Button>

      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="font-semibold text-3xl text-secondary">
              {manual.title}
            </h1>
            <Badge className={statusColors[manual.status]}>
              {statusLabels[manual.status]}
            </Badge>
          </div>
          {manual.description && (
            <p className="text-gray-600 mt-2">{manual.description}</p>
          )}
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setEditOpen(true)}>
            <Edit className="w-4 h-4 mr-2" />
            Editar Manual
          </Button>
          <Button onClick={() => setCreateChapterOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Agregar Capítulo
          </Button>
        </div>
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Manual</DialogTitle>
          </DialogHeader>
          <ManualForm
            manual={{ ...manual, id: manual.id }}
            onSuccess={() => {
              setEditOpen(false);
              router.refresh();
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={createChapterOpen} onOpenChange={setCreateChapterOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Crear Nuevo Capítulo</DialogTitle>
          </DialogHeader>
          <ChapterForm
            manualId={manual.id}
            onSuccess={() => {
              setCreateChapterOpen(false);
              router.refresh();
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
