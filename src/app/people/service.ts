import {serverApi} from "@/lib/serverApi";
import {IUser} from "@/lib/definitions";

export const fetchUsers = async (): Promise<IUser[]> => {
    try {
        const response = await serverApi({
            method: 'GET', path: '/user'
        });
        return response as IUser[];
    } catch (error) {
        console.error("Error fetching user", error);
        return [] as IUser[];
    }
};