import * as React from 'react';
import { AssetsTable } from '@/app/assets/AssetsTable';
import { fetchAssets } from '@/app/assets/services/server';
import { PageSkeleton } from '@/components/PageSkeleton';
import { Suspense } from 'react';
import { CreateAsset } from '@/app/assets/forms/CreateAsset';
import { fetchUserInfo } from '@/components/Header/service';
import { getSession } from '@auth0/nextjs-auth0';

const Assets = async () => {
  const session = await getSession();
  const data = await fetchAssets();
  const user = await fetchUserInfo({
    userId: session?.user?.sub?.split('|')[1],
  });

  return (
    <main className="max-w-screen-2xl mx-auto px-2 pt-24">
      <Suspense fallback={<PageSkeleton />}>
        <div className="flex justify-between items-center my-4">
          <h1 className="font-semibold text-3xl text-secondary animate-fade-right animate-once animate-duration-500 animate-delay-100 animate-ease-in">
            Vehículo
          </h1>
          {user?.access?.admin && <CreateAsset />}
        </div>
        <AssetsTable data={data} user={user} />
      </Suspense>
    </main>
  );
};

export default Assets;
