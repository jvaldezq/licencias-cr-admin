import {IAsset, ILocation} from "@/lib/definitions";
import {clientApi} from "@/lib/clientApi";
import {useMutation, useQuery} from "react-query";
import {AssetForm} from "@/app/assets/AssetForm";

const createAsset = async (data: AssetForm): Promise<IAsset> => {
    const asset = await clientApi.post('/asset', data);
    return asset.data;
};

const updateAsset = async (data: AssetForm): Promise<IAsset> => {
    const asset = await clientApi.patch('/asset', data);
    return asset.data;
};

const getLocationList = async (): Promise<ILocation[]> => {
    const locationList = await clientApi.get('/location', {
        params: {
            list: true
        }
    });
    return locationList.data;
};

const getAssetById = async (id: number): Promise<ILocation> => {
    const location = await clientApi.get(`/asset/${id}`);
    return location.data;
};

export const useGetLocationList = () => {
    return useQuery({
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        queryKey: ["location-list"],
        queryFn: getLocationList,
        retry: 2,
    });
};

export const useCreateMutation = () => {
    return useMutation({
        mutationFn: (data: AssetForm) => {
            return createAsset(data);
        }, mutationKey: ['asset-create'],
    });
};

export const useUpdateMutation = () => {
    return useMutation({
        mutationFn: (data: AssetForm) => {
            return updateAsset(data);
        }, mutationKey: ['asset-update'],
    });
};

export const useGetAssetById = (id: number) => {
    return useQuery({
        enabled: !!id,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        queryKey: ["asset-by-id", id],
        queryFn: () => getAssetById(id),
        retry: 2,
    });
};
