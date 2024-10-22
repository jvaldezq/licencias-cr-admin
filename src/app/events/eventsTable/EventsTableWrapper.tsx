import {IEvent, IEventFilter, IUser} from "@/lib/definitions";
import {getEventsList} from "@/services/events/getEventsList";
import {EventsTable} from "@/app/events/eventsTable/EventsTable";

interface Props {
    filters: string;
    user: IUser;
}

export default async function EventsTableWrapper(props: Props) {
    const { user, filters } = props;
    let data = [] as IEvent[];
    if (filters) {
        const filtersJson = JSON.parse(atob(filters)) as IEventFilter;
        data = await getEventsList(filtersJson);
    }

    return <EventsTable data={data} user={user} filters={filters} />
}