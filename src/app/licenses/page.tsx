import {LicenseTable} from "@/app/licenses/LicenseTable";
import * as React from "react";
import {fetchLicenses} from "@/app/licenses/services/server";
import {PageSkeleton} from "@/components/PageSkeleton";
import {Suspense} from "react";
import {CreateLicense} from "@/app/licenses/forms/CreateLicense";

const Licenses = async () => {
    const data = await fetchLicenses();

    return (<main className="max-w-screen-2xl mx-auto px-6 pt-24">
        <Suspense fallback={<PageSkeleton/>}>
            <div className="flex justify-between items-center my-4">
                <h1 className="font-semibold text-3xl text-secondary animate-fade-right animate-once animate-duration-500 animate-delay-100 animate-ease-in">Licencias</h1>
                <CreateLicense />
            </div>
            <LicenseTable data={data}/>
        </Suspense>
    </main>);
}

export default Licenses;