import { Suspense } from 'react';
import { getSession } from '@auth0/nextjs-auth0';
import { fetchUserInfo } from '@/components/Header/service';
import { TableSkeleton } from '@/components/TableSkeleton';
import { ManualsTable } from './components/ManualsTable';
import { CreateManualButton } from './components/CreateManualButton';

export default async function AssessmentsPage() {
  const session = await getSession();
  const user = await fetchUserInfo({
    userId: session?.user?.sub?.split('|')[1],
  });

  if (!user || !user.access?.admin) {
    return (
      <main className="max-w-screen-2xl mx-auto px-2 pt-24 flex justify-center">
        <h1 className="font-light text-xl text-primary animate-fade-right animate-once animate-duration-500 animate-delay-100 animate-ease-in">
          No tienes permisos para acceder a esta página, por favor contacta al
          administrador.
        </h1>
      </main>
    );
  }

  return (
    <main className="max-w-screen-2xl mx-auto px-6 pt-24 pb-8">
      <div className="flex justify-between items-center my-4">
        <h1 className="font-semibold text-3xl text-secondary animate-fade-right animate-once animate-duration-500 animate-delay-100 animate-ease-in">
          Manuales de Evaluación
        </h1>
        <CreateManualButton />
      </div>

      <Suspense fallback={<TableSkeleton />}>
        <ManualsTable />
      </Suspense>
    </main>
  );
}
