import * as React from "react";
import {AssetsTable} from "@/app/assets/AssetsTable";
import {fetchAssets} from "@/app/assets/services/server";
import {PageSkeleton} from "@/components/PageSkeleton";
import {Suspense} from "react";
import {CreateAsset} from "@/app/assets/forms/CreateAsset";

const Assets = async () => {
    const data = await fetchAssets();

    return (<main className="max-w-screen-2xl mx-auto px-6 pt-24">
        <Suspense fallback={<PageSkeleton/>}>
            <div className="flex justify-between items-center my-4">
                <h1 className="font-semibold text-3xl text-secondary animate-fade-right animate-once animate-duration-500 animate-delay-100 animate-ease-in">Vehículo</h1>
                <CreateAsset />
            </div>
            <AssetsTable data={data}/>
        </Suspense>
    </main>);
}

export default Assets;