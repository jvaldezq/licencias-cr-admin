import * as React from "react";
import {AssetsTableWrapper} from "@/app/assets/AssetsTableWrapper";
import {fetchAssets} from "@/app/assets/service";
import {PageSkeleton} from "@/components/PageSkeleton";
import {Suspense} from "react";
import {CreateAssetWrapper} from "@/app/assets/AssetForm";

export default async function Home() {
    const data = await fetchAssets();

    return (<main className="max-w-screen-2xl mx-auto px-6 pt-24">
        <Suspense fallback={<PageSkeleton/>}>
            <div className="flex justify-between items-center my-4">
                <h1 className="font-semibold text-3xl text-secondary animate-fade-right animate-once animate-duration-500 animate-delay-100 animate-ease-in">Vehículo</h1>
                <CreateAssetWrapper />
            </div>
            <AssetsTableWrapper data={data}/>
        </Suspense>
    </main>);
}
