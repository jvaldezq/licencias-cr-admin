'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { TiptapEditor } from '@/components/TiptapEditor';
import { RichTextDisplay } from '@/components/RichTextDisplay';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useCreateQuestionMutation, useUpdateQuestionMutation } from '../../../../services/client';
import { IQuestion, IAnswerForm } from '@/lib/definitions';
import { toast } from 'sonner';
import { Plus, Trash2, Eye } from 'lucide-react';

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
      { text: '', isCorrect: false, order: 3 },
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

  const getAnswerLetter = (index: number) => {
    return String.fromCharCode(65 + index); // A, B, C, D
  };

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

      {/* Question Preview Section */}
      <Accordion type="single" collapsible>
        <AccordionItem value="preview">
          <AccordionTrigger className="text-base font-medium">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Vista Previa de la Pregunta
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="border rounded-lg p-6 bg-gray-50">
              {/* Question Text */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-medium text-gray-600">Pregunta:</span>
                </div>
                <div className="bg-white p-4 rounded-lg border">
                  {text ? (
                    <RichTextDisplay content={text} />
                  ) : (
                    <p className="text-gray-400 italic">
                      El texto de la pregunta aparecerá aquí...
                    </p>
                  )}
                </div>
              </div>

              {/* Answer Options */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-medium text-gray-600">Opciones:</span>
                </div>
                <div className="space-y-3">
                  {answers.map((answer, index) => {
                    const isCorrect = answer.isCorrect;
                    return (
                      <div
                        key={index}
                        className={`
                          p-4 rounded-lg border-2 transition-all
                          ${
                            isCorrect
                              ? 'border-green-500 bg-green-50'
                              : 'border-gray-200 bg-white'
                          }
                        `}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`
                              flex items-center justify-center w-8 h-8 rounded-full shrink-0 font-semibold text-sm
                              ${
                                isCorrect
                                  ? 'bg-green-500 text-white'
                                  : 'bg-gray-100 text-gray-700'
                              }
                            `}
                          >
                            {getAnswerLetter(index)}
                          </div>
                          <div className="flex-1 text-gray-700">
                            {answer.text || (
                              <span className="text-gray-400 italic">
                                Texto de la respuesta {index + 1}...
                              </span>
                            )}
                          </div>
                          {isCorrect && (
                            <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded">
                              Correcta
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Guardando...' : question ? 'Actualizar' : 'Crear'}
        </Button>
      </div>
    </form>
  );
}
