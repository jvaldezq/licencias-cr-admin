import * as React from "react";
import {PageSkeleton} from "@/components/PageSkeleton";
import {Suspense} from "react";
import UserReport from "@/app/sales/UserReport";

interface Props {
    searchParams: {
        date: string;
    };
}

const Sales = (props: Props) => {
    const {searchParams} = props;
    return (<main className="max-w-screen-2xl mx-auto px-6 pt-24">
        <h1 className="font-semibold text-2xl text-secondary animate-fade-right animate-once animate-duration-500 animate-delay-100 animate-ease-in">Ventas</h1>
        <Suspense fallback={<PageSkeleton/>}>
            <UserReport date={searchParams.date}/>
        </Suspense>
    </main>);
}

export default Sales;