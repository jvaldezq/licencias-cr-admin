import {PageSkeleton} from "@/components/PageSkeleton";
import {Suspense} from "react";
import * as React from "react";
import {CreateEventWrapper} from "@/app/EventsForm";
import {fetchEvents} from "@/app/service";
import {Calendar} from "@/components/Calendar";

export default async function Home() {
    const data = await fetchEvents();
    return (<main className="max-w-screen-2xl mx-auto px-6 pt-24">
        <Suspense fallback={<PageSkeleton/>}>
            <div className="flex justify-between items-center my-4">
                <h1 className="font-semibold text-3xl text-secondary animate-fade-right animate-once animate-duration-500 animate-delay-100 animate-ease-in">Eventos</h1>
                <CreateEventWrapper/>
            </div>
            <Calendar data={data} />
        </Suspense>
    </main>);
}
