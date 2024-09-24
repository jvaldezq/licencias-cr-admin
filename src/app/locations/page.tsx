import {fetchLocations} from "@/app/locations/service";
import * as React from "react";
import {LocationsTableWrapper} from "@/app/locations/LocationsTableWrapper";
import {CreateLocationWrapper} from "@/app/locations/LocationsForm";
import {Suspense} from "react";
import {PageSkeleton} from "@/components/PageSkeleton";

export default async function Home() {
    const data = await fetchLocations();

    return (<main className="max-w-screen-2xl mx-auto px-6 pt-24">
        <Suspense fallback={<PageSkeleton/>}>
            <div className="flex justify-between items-center my-4">
                <h1 className="font-semibold text-3xl text-secondary animate-fade-right animate-once animate-duration-500 animate-delay-100 animate-ease-in">Sedes</h1>
                <CreateLocationWrapper />
            </div>
            <LocationsTableWrapper data={data}/>
        </Suspense>
    </main>);
}
