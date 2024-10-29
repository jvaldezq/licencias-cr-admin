import {serverApi} from "@/lib/serverApi";
import {IAsset} from "@/lib/definitions";

export const fetchAssets = async (): Promise<IAsset[]> => {
    try {
        const response = await serverApi({
            method: 'GET', path: '/asset'
        });
        return response as IAsset[];
    } catch (error) {
        console.error("Error fetching assets", error);
        return [] as IAsset[];
    }
};