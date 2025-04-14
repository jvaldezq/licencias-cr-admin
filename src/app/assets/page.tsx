import * as React from 'react';
import { AssetsTable } from '@/app/assets/AssetsTable';
import { fetchAssets } from '@/app/assets/services/server';
import { PageSkeleton } from '@/components/PageSkeleton';
import { Suspense } from 'react';
import { CreateAsset } from '@/app/assets/forms/CreateAsset';
import { fetchUserInfo } from '@/components/Header/service';
import { getSession } from '@auth0/nextjs-auth0';
import { AssetsFilters } from '@/app/assets/AssetsFilters';
import { IAssetFilter, IEventFilter } from '@/lib/definitions';

interface Props {
  searchParams: {
    filters: string;
  };
}

const Assets = async (props: Props) => {
  const { searchParams } = props;
  const session = await getSession();
  const filtersJson = searchParams?.filters ? JSON.parse(atob(searchParams.filters)) as IEventFilter : null;
  const data = await fetchAssets(filtersJson as IAssetFilter);
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
        <AssetsFilters filters={searchParams?.filters}  user={user}/>
        <AssetsTable data={data} user={user} />
      </Suspense>
    </main>
  );
};

export default Assets;
