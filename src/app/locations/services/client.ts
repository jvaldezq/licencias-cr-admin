import {ILocation} from "@/lib/definitions";
import {clientApi} from "@/lib/clientApi";
import {useMutation, useQuery} from "react-query";
import {LocationFormProps} from "@/app/locations/forms/LocationForm";

const createLocation = async (data: LocationFormProps): Promise<ILocation> => {
    const newListing = await clientApi.post('/location', data);
    return newListing.data;
};

const updateLocation = async (data: LocationFormProps): Promise<ILocation> => {
    const newListing = await clientApi.patch('/location', data);
    return newListing.data;
};

const getLocationById = async (id: string): Promise<ILocation> => {
    const location = await clientApi.get(`/location/${id}`);
    return location.data;
};

const deleteLocation = async (id: string): Promise<ILocation> => {
    const location = await clientApi.delete(`/location/${id}`);
    return location.data;
};

export const useCreateMutation = () => {
    return useMutation({
        mutationFn: (data: LocationFormProps) => {
            return createLocation(data);
        },
        mutationKey: ['location-create'],
    });
};

export const useUpdateMutation = () => {
    return useMutation({
        mutationFn: (data: LocationFormProps) => {
            return updateLocation(data);
        },
        mutationKey: ['location-update'],
    });
};

export const useGetLocationById = (id: string) => {
    return useQuery({
        enabled: !!id,
        cacheTime: 0,
        refetchOnWindowFocus: false,
        queryKey: ["location-by-id", id],
        queryFn: () => getLocationById(id),
        retry: 2,
    });
};

export const useDeleteMutation = () => {
    return useMutation({
        mutationFn: (id: string) => {
            return deleteLocation(id);
        },
        mutationKey: ['location-delete'],
    });
};