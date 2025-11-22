'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateManualMutation, useUpdateManualMutation } from '../services/client';
import { IManualForm, ManualStatus } from '@/lib/definitions';
import { toast } from 'sonner';

interface ManualFormProps {
  manual?: IManualForm & { id: string };
  onSuccess?: () => void;
}

export function ManualForm({ manual, onSuccess }: ManualFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<IManualForm>({
    title: manual?.title || '',
    description: manual?.description || '',
    status: manual?.status || ManualStatus.DRAFT,
  });

  const createMutation = useCreateManualMutation();
  const updateMutation = useUpdateManualMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (manual?.id) {
        await updateMutation.mutateAsync({ ...formData, id: manual.id });
        toast.success('Manual actualizado exitosamente');
      } else {
        const newManual = await createMutation.mutateAsync(formData);
        toast.success('Manual creado exitosamente');
        router.push(`/admin/assessments/${newManual.id}`);
      }
      router.refresh();
      onSuccess?.();
    } catch (error) {
      toast.error('Error al guardar el manual');
      console.error(error);
    }
  };

  const isLoading = createMutation.isLoading || updateMutation.isLoading;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Título *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          placeholder="Nombre del manual"
        />
      </div>

      <div>
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Descripción breve del manual"
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="status">Estado</Label>
        <Select
          value={formData.status}
          onValueChange={(value) => setFormData({ ...formData, status: value as ManualStatus })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ManualStatus.DRAFT}>Borrador</SelectItem>
            <SelectItem value={ManualStatus.PUBLISHED}>Publicado</SelectItem>
            <SelectItem value={ManualStatus.ARCHIVED}>Archivado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Guardando...' : manual ? 'Actualizar' : 'Crear'}
        </Button>
      </div>
    </form>
  );
}
