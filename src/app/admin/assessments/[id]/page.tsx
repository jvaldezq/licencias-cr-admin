import { Suspense } from 'react';
import { getSession } from '@auth0/nextjs-auth0';
import { fetchUserInfo } from '@/components/Header/service';
import { getManualById } from '@/services/assessments/manuals';
import { ManualHeader } from './components/ManualHeader';
import { ChaptersTable } from './components/ChaptersTable';
import { TableSkeleton } from '@/components/TableSkeleton';

interface Props {
  params: { id: string };
}

export default async function ManualDetailPage({ params }: Props) {
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

  const manual = await getManualById(params.id);

  if (!manual) {
    return (
      <main className="max-w-screen-2xl mx-auto px-2 pt-24 flex justify-center">
        <h1 className="font-light text-xl text-primary">
          Manual no encontrado.
        </h1>
      </main>
    );
  }

  return (
    <main className="max-w-screen-2xl mx-auto px-6 pt-24 pb-8">
      <ManualHeader manual={manual} />

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Capítulos</h2>
        <Suspense fallback={<TableSkeleton />}>
          <ChaptersTable manualId={params.id} chapters={manual.chapters || []} />
        </Suspense>
      </div>
    </main>
  );
}
