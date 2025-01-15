import * as React from 'react';
import { PageSkeleton } from '@/components/PageSkeleton';
import { Suspense } from 'react';
import { PeopleTable } from '@/app/people/PeopleTable';
import { fetchUsers } from '@/app/people/services/server';

const People = async () => {
  const data = await fetchUsers();
  return (
    <main className="max-w-screen-2xl mx-auto px-2 pt-24">
      <Suspense fallback={<PageSkeleton />}>
        <div className="flex justify-between items-center my-4">
          <h1 className="font-semibold text-3xl text-secondary animate-fade-right animate-once animate-duration-500 animate-delay-100 animate-ease-in">
            Planilla
          </h1>
        </div>
        <PeopleTable data={data} />
      </Suspense>
    </main>
  );
};

export default People;
