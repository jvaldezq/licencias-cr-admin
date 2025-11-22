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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Edit, Trash2, Plus, GripVertical } from 'lucide-react';
import { useDeleteQuestionMutation } from '../../../../services/client';
import { IQuestion } from '@/lib/definitions';
import { QuestionForm } from './QuestionForm';
import { toast } from 'sonner';

interface QuestionsSectionProps {
  chapterId: string;
  questions: IQuestion[];
}

export function QuestionsSection({ chapterId, questions }: QuestionsSectionProps) {
  const router = useRouter();
  const [createOpen, setCreateOpen] = useState(false);
  const [editQuestion, setEditQuestion] = useState<IQuestion | null>(null);
  const deleteMutation = useDeleteQuestionMutation();

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta pregunta?')) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(id);
      toast.success('Pregunta eliminada exitosamente');
      router.refresh();
    } catch (error) {
      toast.error('Error al eliminar la pregunta');
      console.error(error);
    }
  };

  const sortedQuestions = [...questions].sort((a, b) => a.order - b.order);

  const getQuestionPreview = (text: string) => {
    try {
      const parsed = JSON.parse(text);
      const firstParagraph = parsed.content?.find(
        (node: { type: string }) => node.type === 'paragraph'
      );
      return firstParagraph?.content?.[0]?.text || 'Sin texto';
    } catch {
      return text.slice(0, 100) + (text.length > 100 ? '...' : '');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Agregar Pregunta
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>Orden</TableHead>
              <TableHead>Pregunta</TableHead>
              <TableHead>Respuestas</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedQuestions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  No hay preguntas. Crea una para comenzar.
                </TableCell>
              </TableRow>
            ) : (
              sortedQuestions.map((question) => (
                <TableRow key={question.id}>
                  <TableCell>
                    <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                  </TableCell>
                  <TableCell>{question.order}</TableCell>
                  <TableCell>
                    <div className="max-w-md">
                      {getQuestionPreview(question.text)}
                    </div>
                  </TableCell>
                  <TableCell>{question.answers?.length || 0}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditQuestion(question)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(question.id)}
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

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Crear Nueva Pregunta</DialogTitle>
          </DialogHeader>
          <QuestionForm
            chapterId={chapterId}
            onSuccess={() => {
              setCreateOpen(false);
              router.refresh();
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editQuestion} onOpenChange={() => setEditQuestion(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Pregunta</DialogTitle>
          </DialogHeader>
          {editQuestion && (
            <QuestionForm
              chapterId={chapterId}
              question={editQuestion}
              onSuccess={() => {
                setEditQuestion(null);
                router.refresh();
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
