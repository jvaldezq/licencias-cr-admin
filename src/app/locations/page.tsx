import {fetchLocations} from "@/app/locations/service";
import {Button} from "@/components/ui/button";
import * as React from "react";
import {LocationsTableWrapper} from "@/app/locations/LocationsTableWrapper";
import {Dialog} from "@/components/Dialog";
import {LocationsForm} from "@/app/locations/LocationsForm";

export default async function Home() {
    const data = await fetchLocations();

    return (<main className="max-w-screen-2xl mx-auto px-6 pt-24">
        <div className="flex justify-between items-center my-4">
            <h1 className="font-semibold text-3xl text-secondary animate-fade-right animate-once animate-duration-500 animate-delay-100 animate-ease-in">Sedes</h1>
            <Dialog
                title="Creación de nueva sede"
                footer={<Button className="bg-secondary text-white rounded-3xl animate-fade-right animate-once animate-duration-500 animate-delay-100 animate-ease-in">Guardar</Button>}
                trigger={<Button className="bg-secondary text-white rounded-3xl animate-fade-left animate-once animate-duration-500 animate-delay-100 animate-ease-in">Crear</Button>}>
                <LocationsForm />
            </Dialog>
        </div>
        <LocationsTableWrapper data={data}/>
    </main>);
}
