import {Button} from "@/components/ui/button";
import * as React from "react";
import {AssetsTableWrapper} from "@/app/assets/AssetsTableWrapper";
import {fetchAssets} from "@/app/assets/service";

export default async function Home() {
    const data = await fetchAssets();

    return (<main className="max-w-screen-2xl mx-auto px-6 pt-24">
        <div className="flex justify-between items-center my-4">
            <h1 className="font-semibold text-3xl text-secondary animate-fade-right animate-once animate-duration-500 animate-delay-100 animate-ease-in">Vehiculos</h1>
            <Button className="bg-secondary text-white rounded-3xl animate-fade-left animate-once animate-duration-500 animate-delay-100 animate-ease-in">Crear</Button>
        </div>
        <AssetsTableWrapper data={data}/>
    </main>);
}
