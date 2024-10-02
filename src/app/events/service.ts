import {serverApi} from "@/lib/serverApi";
import {IEvent, ILocation, IUser} from "@/lib/definitions";

export const fetchEvents = async (searchParams: {
    filters: string;
}, user: IUser): Promise<IEvent[]> => {
    try {
        const params = searchParams.filters ? atob(searchParams.filters) : '{}';
        const instructorId = user?.access?.instructor ? user?.id : undefined;
        const paramsObj = {
            locationId: user?.location?.id, instructorId: instructorId, date: new Date(), ...JSON.parse(params)
        }
        const response = await serverApi({
            method: 'GET', path: '/event', params: paramsObj
        });
        return response as IEvent[];
    } catch (error) {
        console.error("Error fetching events", error);
        return [] as IEvent[];
    }
};