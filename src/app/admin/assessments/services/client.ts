import {
  IManual,
  IManualForm,
  IChapter,
  IChapterForm,
  IQuestion,
  IQuestionForm,
  ManualStatus,
} from '@/lib/definitions';
import { clientApi } from '@/lib/clientApi';
import { useMutation, useQuery } from 'react-query';

// ========== MANUALS ==========

const createManual = async (data: IManualForm): Promise<IManual> => {
  const manual = await clientApi.post('/assessments/manuals', data);
  return manual.data;
};

const getManualById = async (id: string): Promise<IManual> => {
  const manual = await clientApi.get(`/assessments/manuals/${id}`);
  return manual.data;
};

const getManualsList = async (filters?: {
  status?: ManualStatus;
  searchTerm?: string;
}): Promise<IManual[]> => {
  const params = new URLSearchParams();
  if (filters?.status) params.append('status', filters.status);
  if (filters?.searchTerm) params.append('searchTerm', filters.searchTerm);

  const manuals = await clientApi.get(
    `/assessments/manuals?${params.toString()}`
  );
  return manuals.data;
};

const updateManual = async (data: IManualForm): Promise<IManual> => {
  const manual = await clientApi.patch(
    `/assessments/manuals/${data.id}`,
    data
  );
  return manual.data;
};

const deleteManual = async (id: string): Promise<void> => {
  await clientApi.delete(`/assessments/manuals/${id}`);
};

export const useCreateManualMutation = () => {
  return useMutation({
    mutationFn: (data: IManualForm) => createManual(data),
    mutationKey: ['manual-create'],
  });
};

export const useGetManualById = (id: string) => {
  return useQuery({
    enabled: !!id,
    refetchOnWindowFocus: false,
    queryKey: ['manual-by-id', id],
    queryFn: () => getManualById(id),
    retry: 2,
  });
};

export const useGetManualsList = (filters?: {
  status?: ManualStatus;
  searchTerm?: string;
}) => {
  return useQuery({
    refetchOnWindowFocus: false,
    queryKey: ['manuals-list', filters],
    queryFn: () => getManualsList(filters),
    retry: 2,
  });
};

export const useUpdateManualMutation = () => {
  return useMutation({
    mutationFn: (data: IManualForm) => updateManual(data),
    mutationKey: ['manual-update'],
  });
};

export const useDeleteManualMutation = () => {
  return useMutation({
    mutationFn: (id: string) => deleteManual(id),
    mutationKey: ['manual-delete'],
  });
};

// ========== CHAPTERS ==========

const createChapter = async (data: IChapterForm): Promise<IChapter> => {
  const chapter = await clientApi.post('/assessments/chapters', data);
  return chapter.data;
};

const getChapterById = async (id: string): Promise<IChapter> => {
  const chapter = await clientApi.get(`/assessments/chapters/${id}`);
  return chapter.data;
};

const getChaptersByManualId = async (manualId: string): Promise<IChapter[]> => {
  const chapters = await clientApi.get(
    `/assessments/chapters?manualId=${manualId}`
  );
  return chapters.data;
};

const updateChapter = async (data: IChapterForm): Promise<IChapter> => {
  const chapter = await clientApi.patch(
    `/assessments/chapters/${data.id}`,
    data
  );
  return chapter.data;
};

const deleteChapter = async (id: string): Promise<void> => {
  await clientApi.delete(`/assessments/chapters/${id}`);
};

const reorderChapters = async (
  manualId: string,
  chapterOrders: { id: string; order: number }[]
): Promise<void> => {
  await clientApi.patch(`/assessments/chapters/${manualId}/reorder`, {
    chapterOrders,
  });
};

export const useCreateChapterMutation = () => {
  return useMutation({
    mutationFn: (data: IChapterForm) => createChapter(data),
    mutationKey: ['chapter-create'],
  });
};

export const useGetChapterById = (id: string) => {
  return useQuery({
    enabled: !!id,
    refetchOnWindowFocus: false,
    queryKey: ['chapter-by-id', id],
    queryFn: () => getChapterById(id),
    retry: 2,
  });
};

export const useGetChaptersByManualId = (manualId: string) => {
  return useQuery({
    enabled: !!manualId,
    refetchOnWindowFocus: false,
    queryKey: ['chapters-by-manual', manualId],
    queryFn: () => getChaptersByManualId(manualId),
    retry: 2,
  });
};

export const useUpdateChapterMutation = () => {
  return useMutation({
    mutationFn: (data: IChapterForm) => updateChapter(data),
    mutationKey: ['chapter-update'],
  });
};

export const useDeleteChapterMutation = () => {
  return useMutation({
    mutationFn: (id: string) => deleteChapter(id),
    mutationKey: ['chapter-delete'],
  });
};

export const useReorderChaptersMutation = () => {
  return useMutation({
    mutationFn: ({
      manualId,
      chapterOrders,
    }: {
      manualId: string;
      chapterOrders: { id: string; order: number }[];
    }) => reorderChapters(manualId, chapterOrders),
    mutationKey: ['chapters-reorder'],
  });
};

// ========== QUESTIONS ==========

const createQuestion = async (data: IQuestionForm): Promise<IQuestion> => {
  const question = await clientApi.post('/assessments/questions', data);
  return question.data;
};

const getQuestionById = async (id: string): Promise<IQuestion> => {
  const question = await clientApi.get(`/assessments/questions/${id}`);
  return question.data;
};

const getQuestionsByChapterId = async (
  chapterId: string
): Promise<IQuestion[]> => {
  const questions = await clientApi.get(
    `/assessments/questions?chapterId=${chapterId}`
  );
  return questions.data;
};

const updateQuestion = async (data: IQuestionForm): Promise<IQuestion> => {
  const question = await clientApi.patch(
    `/assessments/questions/${data.id}`,
    data
  );
  return question.data;
};

const deleteQuestion = async (id: string): Promise<void> => {
  await clientApi.delete(`/assessments/questions/${id}`);
};

const reorderQuestions = async (
  chapterId: string,
  questionOrders: { id: string; order: number }[]
): Promise<void> => {
  await clientApi.patch(`/assessments/questions/${chapterId}/reorder`, {
    questionOrders,
  });
};

export const useCreateQuestionMutation = () => {
  return useMutation({
    mutationFn: (data: IQuestionForm) => createQuestion(data),
    mutationKey: ['question-create'],
  });
};

export const useGetQuestionById = (id: string) => {
  return useQuery({
    enabled: !!id,
    refetchOnWindowFocus: false,
    queryKey: ['question-by-id', id],
    queryFn: () => getQuestionById(id),
    retry: 2,
  });
};

export const useGetQuestionsByChapterId = (chapterId: string) => {
  return useQuery({
    enabled: !!chapterId,
    refetchOnWindowFocus: false,
    queryKey: ['questions-by-chapter', chapterId],
    queryFn: () => getQuestionsByChapterId(chapterId),
    retry: 2,
  });
};

export const useUpdateQuestionMutation = () => {
  return useMutation({
    mutationFn: (data: IQuestionForm) => updateQuestion(data),
    mutationKey: ['question-update'],
  });
};

export const useDeleteQuestionMutation = () => {
  return useMutation({
    mutationFn: (id: string) => deleteQuestion(id),
    mutationKey: ['question-delete'],
  });
};

export const useReorderQuestionsMutation = () => {
  return useMutation({
    mutationFn: ({
      chapterId,
      questionOrders,
    }: {
      chapterId: string;
      questionOrders: { id: string; order: number }[];
    }) => reorderQuestions(chapterId, questionOrders),
    mutationKey: ['questions-reorder'],
  });
};
