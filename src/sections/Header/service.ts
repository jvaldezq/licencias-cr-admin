import {serverApi} from "@/lib/serverApi";
import {IUser} from "@/lib/definitions";

interface SearchParamsProps {
    userId: string;
}

export const fetchUserInfo = async (searchParams: SearchParamsProps): Promise<IUser> => {
    try {
        const response = await serverApi({
            method: 'GET', path: '/user', params: searchParams
        });
        return response as IUser;
    } catch (error) {
        console.error("Error parsing filters:", error);
        return {} as IUser;
    }
};