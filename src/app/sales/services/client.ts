import {IAsset, IEventType, ILocation} from "@/lib/definitions";
import {clientApi} from "@/lib/clientApi";
import {useMutation, useQuery} from "react-query";
import {AssetFormProps} from "@/app/assets/forms/AssetForm";

const createAsset = async (data: AssetFormProps): Promise<IAsset> => {
    const asset = await clientApi.post('/asset', data);
    return asset.data;
};

const updateAsset = async (data: AssetFormProps): Promise<IAsset> => {
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

const getAssetById = async (id: string): Promise<ILocation> => {
    const location = await clientApi.get(`/asset/${id}`);
    return location.data;
};


const deleteAsset = async (id: string): Promise<IAsset> => {
    const asset = await clientApi.delete(`/asset/${id}`);
    return asset.data;
};

const getLicenseList = async (): Promise<IEventType[]> => {
    const locationList = await clientApi.get('/license', {
        params: {
            list: true
        }
    });
    return locationList.data;
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
        mutationFn: (data: AssetFormProps) => {
            return createAsset(data);
        }, mutationKey: ['asset-create'],
    });
};

export const useUpdateMutation = () => {
    return useMutation({
        mutationFn: (data: AssetFormProps) => {
            return updateAsset(data);
        }, mutationKey: ['asset-update'],
    });
};

export const useGetAssetById = (id: string) => {
    return useQuery({
        enabled: !!id,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        queryKey: ["asset-by-id", id],
        queryFn: () => getAssetById(id),
        retry: 2,
    });
};

export const useGetLicenseList = () => {
    return useQuery({
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        queryKey: ["license-list"],
        queryFn: getLicenseList,
        retry: 2,
    });
};


export const useDeleteMutation = () => {
    return useMutation({
        mutationFn: (id: string) => {
            return deleteAsset(id);
        },
        mutationKey: ['asset-delete'],
    });
};
