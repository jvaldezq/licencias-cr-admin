import { Suspense } from 'react';
import { getSession } from '@auth0/nextjs-auth0';
import { fetchUserInfo } from '@/components/Header/service';
import { getChapterById } from '@/services/assessments/chapters';
import { ChapterHeader } from './components/ChapterHeader';
import { ChapterContentEditor } from './components/ChapterContentEditor';
import { QuestionsSection } from './components/QuestionsSection';
import { TableSkeleton } from '@/components/TableSkeleton';

interface Props {
  params: { id: string; chapterId: string };
}

export default async function ChapterDetailPage({ params }: Props) {
  const session = await getSession();
  const user = await fetchUserInfo({
    userId: session?.user?.sub?.split('|')[1],
  });

  if (!user || !user.access?.admin) {
    return (
      <main className="max-w-screen-2xl mx-auto px-2 pt-24 flex justify-center">
        <h1 className="font-light text-xl text-primary">
          No tienes permisos para acceder a esta página.
        </h1>
      </main>
    );
  }

  const chapter = await getChapterById(params.chapterId);

  if (!chapter) {
    return (
      <main className="max-w-screen-2xl mx-auto px-2 pt-24 flex justify-center">
        <h1 className="font-light text-xl text-primary">
          Capítulo no encontrado.
        </h1>
      </main>
    );
  }

  return (
    <main className="max-w-screen-2xl mx-auto px-6 pt-24 pb-8">
      <ChapterHeader chapter={chapter} manualId={params.id} />

      <div className="mt-8 space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Contenido del Capítulo</h2>
          <ChapterContentEditor chapter={chapter} />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Preguntas</h2>
          <Suspense fallback={<TableSkeleton />}>
            <QuestionsSection
              chapterId={params.chapterId}
              questions={chapter.questions || []}
            />
          </Suspense>
        </section>
      </div>
    </main>
  );
}
