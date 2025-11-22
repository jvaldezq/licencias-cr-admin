'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { TiptapEditor } from '@/components/TiptapEditor';
import { useCreateQuestionMutation, useUpdateQuestionMutation } from '../../../../services/client';
import { IQuestion, IAnswerForm } from '@/lib/definitions';
import { toast } from 'sonner';
import { Plus, Trash2 } from 'lucide-react';

interface QuestionFormProps {
  chapterId: string;
  question?: IQuestion;
  onSuccess?: () => void;
}

export function QuestionForm({ chapterId, question, onSuccess }: QuestionFormProps) {
  const router = useRouter();
  const [text, setText] = useState(question?.text || '');
  const [answers, setAnswers] = useState<IAnswerForm[]>(
    question?.answers?.map((a) => ({
      id: a.id,
      text: a.text,
      isCorrect: a.isCorrect,
      order: a.order,
    })) || [
      { text: '', isCorrect: true, order: 1 },
      { text: '', isCorrect: false, order: 2 },
    ]
  );

  const createMutation = useCreateQuestionMutation();
  const updateMutation = useUpdateQuestionMutation();

  const handleAddAnswer = () => {
    setAnswers([
      ...answers,
      {
        text: '',
        isCorrect: false,
        order: answers.length + 1,
      },
    ]);
  };

  const handleRemoveAnswer = (index: number) => {
    if (answers.length <= 2) {
      toast.error('Debe haber al menos 2 respuestas');
      return;
    }
    const newAnswers = answers.filter((_, i) => i !== index);
    setAnswers(newAnswers.map((a, i) => ({ ...a, order: i + 1 })));
  };

  const handleAnswerTextChange = (index: number, text: string) => {
    const newAnswers = [...answers];
    newAnswers[index].text = text;
    setAnswers(newAnswers);
  };

  const handleCorrectChange = (index: number) => {
    const newAnswers = answers.map((a, i) => ({
      ...a,
      isCorrect: i === index,
    }));
    setAnswers(newAnswers);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!text.trim()) {
      toast.error('El texto de la pregunta es requerido');
      return;
    }

    if (answers.length < 2) {
      toast.error('Debe haber al menos 2 respuestas');
      return;
    }

    if (answers.some((a) => !a.text.trim())) {
      toast.error('Todas las respuestas deben tener texto');
      return;
    }

    if (!answers.some((a) => a.isCorrect)) {
      toast.error('Debe marcar al menos una respuesta como correcta');
      return;
    }

    try {
      const formData = {
        chapterId,
        text,
        answers,
      };

      if (question?.id) {
        await updateMutation.mutateAsync({ ...formData, id: question.id });
        toast.success('Pregunta actualizada exitosamente');
      } else {
        await createMutation.mutateAsync(formData);
        toast.success('Pregunta creada exitosamente');
      }
      router.refresh();
      onSuccess?.();
    } catch (error) {
      toast.error('Error al guardar la pregunta');
      console.error(error);
    }
  };

  const isLoading = createMutation.isLoading || updateMutation.isLoading;
  const correctAnswerIndex = answers.findIndex((a) => a.isCorrect);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label>Texto de la Pregunta *</Label>
        <TiptapEditor
          content={text}
          onChange={setText}
          placeholder="Escribe tu pregunta aquí..."
          minHeight="150px"
        />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label>Respuestas (mínimo 2) *</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddAnswer}
          >
            <Plus className="w-4 h-4 mr-2" />
            Agregar Respuesta
          </Button>
        </div>

        <RadioGroup value={correctAnswerIndex.toString()}>
          <div className="space-y-3">
            {answers.map((answer, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-4 border rounded-lg"
              >
                <div className="flex items-center pt-2">
                  <RadioGroupItem
                    value={index.toString()}
                    onClick={() => handleCorrectChange(index)}
                    title="Marcar como respuesta correcta"
                  />
                </div>

                <div className="flex-1">
                  <Input
                    value={answer.text}
                    onChange={(e) => handleAnswerTextChange(index, e.target.value)}
                    placeholder={`Respuesta ${index + 1}`}
                    required
                  />
                  {answer.isCorrect && (
                    <p className="text-xs text-green-600 mt-1">
                      Respuesta correcta
                    </p>
                  )}
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveAnswer(index)}
                  disabled={answers.length <= 2}
                  title="Eliminar respuesta"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </RadioGroup>

        <p className="text-sm text-gray-500">
          Selecciona el círculo para marcar la respuesta correcta
        </p>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Guardando...' : question ? 'Actualizar' : 'Crear'}
        </Button>
      </div>
    </form>
  );
}
