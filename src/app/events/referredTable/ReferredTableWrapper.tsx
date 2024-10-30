import {IEvent, IEventFilter, IUser} from "@/lib/definitions";
import {getEventsReferredList} from "@/services/events/getEventsList";
import {ReferredTable} from "@/app/events/referredTable/ReferredTable";

interface Props {
    filters: string;
    user: IUser;
}

export default async function ReferredTableWrapper(props: Props) {
    const { user, filters } = props;
    let data = [] as IEvent[];
    if (filters) {
        const filtersJson = JSON.parse(atob(filters)) as IEventFilter;
        data = await getEventsReferredList(filtersJson);
    }

    return <ReferredTable data={data} user={user} filters={filters} />
}