import {PageSkeleton} from "@/components/PageSkeleton";
import {Suspense} from "react";
import * as React from "react";
import {CreateEventWrapper} from "@/app/events/EventsForm";
import {fetchEvents} from "@/app/events/service";
import {getSession} from "@auth0/nextjs-auth0";
import {fetchUserInfo} from "@/components/Header/service";
import {EventsTableWrapper} from "@/app/events/EventsTableWrapper";

export default async function Events({
                                         searchParams
                                     }: { searchParams: {
        filters: string;
    } }) {
    const session = await getSession();
    const user = await fetchUserInfo({userId: session?.user?.sub?.split('|')[1]});
    const data = await fetchEvents(searchParams, user);
    console.log(data);

    return (<main className="max-w-screen-2xl mx-auto px-6 pt-24">
        <Suspense fallback={<PageSkeleton/>}>
            <div className="flex justify-between items-center my-4">
                <h1 className="font-semibold text-3xl text-secondary animate-fade-right animate-once animate-duration-500 animate-delay-100 animate-ease-in">Citas</h1>
                <CreateEventWrapper user={user} />
            </div>
            <EventsTableWrapper data={data} user={user}/>
        </Suspense>
    </main>);
}
