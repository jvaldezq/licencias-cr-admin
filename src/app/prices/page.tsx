import * as React from 'react';
import { fetchPrices } from '@/app/prices/services/server';
import { PageSkeleton } from '@/components/PageSkeleton';
import { Suspense } from 'react';
import { fetchUserInfo } from '@/components/Header/service';
import { getSession } from '@auth0/nextjs-auth0';
import { IPriceFilter } from '@/lib/definitions';
import { CreatePrice } from '@/app/prices/forms/CreatePrice';
import { PricesFilters } from '@/app/prices/PricesFilters';
import { PriceTable } from '@/app/prices/PriceTable';

interface Props {
  searchParams: {
    filters: string;
  };
}

const Prices = async (props: Props) => {
  const { searchParams } = props;
  const session = await getSession();
  const filtersJson = searchParams?.filters
    ? (JSON.parse(atob(searchParams.filters)) as IPriceFilter)
    : null;
  const data = await fetchPrices(filtersJson as IPriceFilter);
  const user = await fetchUserInfo({
    userId: session?.user?.sub?.split('|')[1],
  });

  return (
    <main className="max-w-screen-2xl mx-auto px-2 pt-24">
      <Suspense fallback={<PageSkeleton />}>
        <div className="flex justify-between items-center my-4">
          <h1 className="font-semibold text-3xl text-secondary animate-fade-right animate-once animate-duration-500 animate-delay-100 animate-ease-in">
            Precios
          </h1>
          {user?.access?.admin && <CreatePrice />}
        </div>
        <PricesFilters filters={searchParams?.filters} user={user} />
        <PriceTable data={data} user={user} />
      </Suspense>
    </main>
  );
};

export default Prices;
