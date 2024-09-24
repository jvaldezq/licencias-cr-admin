import {ILocation} from "@/lib/definitions";
import {clientApi} from "@/lib/clientApi";
import {useMutation, useQuery} from "react-query";
import {LocationForm} from "@/app/locations/LocationsForm";

const createLocation = async (data: LocationForm): Promise<ILocation> => {
    const newListing = await clientApi.post('/location', data);
    return newListing.data;
};

const updateLocation = async (data: LocationForm): Promise<ILocation> => {
    const newListing = await clientApi.patch('/location', data);
    return newListing.data;
};

const getLocationById = async (id: number): Promise<ILocation> => {
    const location = await clientApi.get(`/location/${id}`);
    return location.data;
};

export const useCreateMutation = () => {
    return useMutation({
        mutationFn: (data: LocationForm) => {
            return createLocation(data);
        },
        mutationKey: ['location-create'],
    });
};

export const useUpdateMutation = () => {
    return useMutation({
        mutationFn: (data: LocationForm) => {
            return updateLocation(data);
        },
        mutationKey: ['location-update'],
    });
};

export const useGetLocationById = (id: number) => {
    return useQuery({
        enabled: !!id,
        refetchOnWindowFocus: false,
        queryKey: ["location-by-id", id],
        queryFn: () => getLocationById(id),
        retry: 2,
    });
};
