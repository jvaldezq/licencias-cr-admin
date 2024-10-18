import {serverApi} from "@/lib/serverApi";
import {ILocation} from "@/lib/definitions";

export const fetchLocations = async (): Promise<ILocation[]> => {
    try {
        const response = await serverApi({
            method: 'GET', path: '/location'
        });
        return response as ILocation[];
    } catch (error) {
        console.error("Error fetching locations", error);
        return [] as ILocation[];
    }
};