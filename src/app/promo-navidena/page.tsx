import * as React from 'react';
import { Suspense } from 'react';
import { getSession } from '@auth0/nextjs-auth0';
import { fetchUserInfo } from '@/components/Header/service';
import { PageSkeleton } from '@/components/PageSkeleton';
import { fetchPromoParticipants } from './services/server';
import { PromoNavidenaClient } from './PromoNavidenaClient';

const PromoNavidena = async () => {
  const session = await getSession();
  await fetchUserInfo({
    userId: session?.user?.sub?.split('|')[1],
  });
  const data = await fetchPromoParticipants();

  return (
    <main className="max-w-screen-2xl mx-auto px-2 pt-24">
      <Suspense fallback={<PageSkeleton />}>
        <div className="flex justify-between items-center my-4">
          <h1 className="font-semibold text-3xl text-secondary animate-fade-right animate-once animate-duration-500 animate-delay-100 animate-ease-in">
            Promo Navideña 🎁
          </h1>
        </div>
        <div className="mb-4 text-gray-600">
          <p>Total de participantes: <span className="font-bold text-amber-600">{data.length}</span></p>
        </div>
        <PromoNavidenaClient initialData={data} />
      </Suspense>
    </main>
  );
};

export default PromoNavidena;
