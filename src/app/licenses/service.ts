import {serverApi} from "@/lib/serverApi";
import {ILicenseType, ILocation, IUser} from "@/lib/definitions";

export const fetchLicenses = async (): Promise<ILicenseType[]> => {
    try {
        const response = await serverApi({
            method: 'GET', path: '/license'
        });
        return response as ILicenseType[];
    } catch (error) {
        console.error("Error fetching licenses", error);
        return [] as ILicenseType[];
    }
};