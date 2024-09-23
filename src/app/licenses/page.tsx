import {Button} from "@/components/ui/button";
import {LicenseTableWrapper} from "@/app/licenses/LicenseTableWrapper";
import * as React from "react";
import {fetchLicenses} from "@/app/licenses/service";

export default async function Home() {
    const data = await fetchLicenses();

    return (<main className="max-w-screen-2xl mx-auto px-6 pt-24">
        <div className="flex justify-between items-center my-4">
            <h1 className="font-semibold text-3xl text-secondary animate-fade-right animate-once animate-duration-500 animate-delay-100 animate-ease-in">Licencias</h1>
            <Button className="bg-secondary text-white rounded-3xl animate-fade-left animate-once animate-duration-500 animate-delay-100 animate-ease-in">Crear</Button>
        </div>
        <LicenseTableWrapper data={data}/>
    </main>);
}
