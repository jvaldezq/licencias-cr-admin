import {Suspense} from "react";
import * as React from "react";
import {getSession} from "@auth0/nextjs-auth0";
import {fetchUserInfo} from "@/components/Header/service";
import {TableSkeleton} from "@/components/TableSkeleton";
import {CreateEvent} from "@/app/events/forms/CreateEvent";
import {EventsFilters} from "@/app/events/eventsTable/EventsFilters";
import EventsTableWrapper from "@/app/events/eventsTable/EventsTableWrapper";

interface Props {
    searchParams: {
        filters: string;
    };
}

export default async function Events(props: Props) {
    const {searchParams} = props;
    const session = await getSession();
    const user = await fetchUserInfo({userId: session?.user?.sub?.split('|')[1]});

    return (<main className="max-w-screen-2xl mx-auto px-6 pt-24">
        <div className="flex justify-between items-center my-4">
            <h1 className="font-semibold text-3xl text-secondary animate-fade-right animate-once animate-duration-500 animate-delay-100 animate-ease-in">Citas</h1>
            {
                user?.access?.receptionist || user?.access?.admin && <CreateEvent user={user}/>
            }
        </div>
        <EventsFilters filters={searchParams?.filters} user={user} />
        <Suspense fallback={<TableSkeleton/>}>
            <EventsTableWrapper filters={searchParams?.filters} user={user}/>
        </Suspense>
    </main>);
}
