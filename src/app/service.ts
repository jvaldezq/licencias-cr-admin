import {serverApi} from "@/lib/serverApi";
import {IEvent, ILocation} from "@/lib/definitions";

export const fetchEvents = async (): Promise<IEvent[]> => {
    try {
        const response = await serverApi({
            method: 'GET', path: '/event'
        });
        return response as IEvent[];
    } catch (error) {
        console.error("Error fetching events", error);
        return [] as IEvent[];
    }
};