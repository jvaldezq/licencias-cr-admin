import * as React from "react";
import {PageSkeleton} from "@/components/PageSkeleton";
import {Suspense} from "react";
import UserReport from "@/app/sales/UserReport";

const Sales = () => {
    return (<main className="max-w-screen-2xl mx-auto px-6 pt-24">
        <h1 className="font-semibold text-3xl text-secondary animate-fade-right animate-once animate-duration-500 animate-delay-100 animate-ease-in">Ventas</h1>
        <Suspense fallback={<PageSkeleton/>}>
            <UserReport/>
        </Suspense>
    </main>);
}

export default Sales;