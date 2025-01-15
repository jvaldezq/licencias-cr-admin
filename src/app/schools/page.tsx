import * as React from 'react';
import { PageSkeleton } from '@/components/PageSkeleton';
import { Suspense } from 'react';
import { getSchools } from '@/services/schools/getSchools';
import { SchoolTable } from '@/app/schools/SchoolTable';
import { ISchool } from '@/lib/definitions';
import { CreateSchool } from '@/app/schools/forms/CreateSchool';

const Schools = async () => {
  const data = (await getSchools()) as unknown as ISchool[];

  return (
    <main className="max-w-screen-2xl mx-auto px-2 pt-24">
      <Suspense fallback={<PageSkeleton />}>
        <div className="flex justify-between items-center my-4">
          <h1 className="font-semibold text-3xl text-secondary animate-fade-right animate-once animate-duration-500 animate-delay-100 animate-ease-in">
            Escuelas
          </h1>
          <CreateSchool />
        </div>
        <SchoolTable data={data} />
      </Suspense>
    </main>
  );
};

export default Schools;
