import {fetchLocations} from "@/app/locations/services/server";
import * as React from "react";
import {LocationsTable} from "@/app/locations/LocationsTable";
import {Suspense} from "react";
import {PageSkeleton} from "@/components/PageSkeleton";
import {CreateLocation} from "@/app/locations/forms/CreateLocation";

const Locations = async () => {
    const data = await fetchLocations();

    return (<main className="max-w-screen-2xl mx-auto px-6 pt-24">
        <Suspense fallback={<PageSkeleton/>}>
            <div className="flex justify-between items-center my-4">
                <h1 className="font-semibold text-3xl text-secondary animate-fade-right animate-once animate-duration-500 animate-delay-100 animate-ease-in">Sedes</h1>
                <CreateLocation />
            </div>
            <LocationsTable data={data}/>
        </Suspense>
    </main>);
}

export default Locations;