import {IAsset, IEvent, IEventForm, IEventType, ILocation, IUser, PAYMENT_TYPE} from "@/lib/definitions";
import {clientApi} from "@/lib/clientApi";
import {useMutation, useQuery} from "react-query";
import {AssetsByProps} from "@/app/events/services/types";

const createEvent = async (data: IEventForm): Promise<IEvent> => {
    const newListing = await clientApi.post('/event', data);
    return newListing.data;
};

export const useCreateMutation = () => {
    return useMutation({
        mutationFn: (data: IEventForm) => {
            return createEvent(data);
        }, mutationKey: ['event-create'],
    });
};

const updateEvent = async (data: IEventForm): Promise<IEvent> => {
    const newEvent = await clientApi.patch(`/event/${data.id}`, data);
    return newEvent.data;
};

export const useUpdateMutation = () => {
    return useMutation({
        mutationFn: (data: IEventForm) => {
            return updateEvent(data);
        }, mutationKey: ['event-update'],
    });
};

const getEventById = async (id: string): Promise<IEvent> => {
    const event = await clientApi.get(`/event/${id}`);
    return event.data;
};

export const useGetEventById = (id: string) => {
    return useQuery({
        enabled: !!id,
        refetchOnWindowFocus: false,
        queryKey: ["event-by-id", id],
        queryFn: () => getEventById(id),
        retry: 2,
    });
};

const getLocationList = async (): Promise<ILocation[]> => {
    const locationList = await clientApi.get('/location', {
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

const getInstructorListByLocationId = async (id: string): Promise<IUser[]> => {
    const userList = await clientApi.get('/user/list', {
        params: {
            isInstructor: true, locationId: id
        }
    });
    return userList.data;
};

export const useGetInstructorListByLocationId = (id: string) => {
    return useQuery({
        enabled: !!id,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        queryKey: ["instructor-list", id],
        queryFn: () => getInstructorListByLocationId(id),
        retry: 2,
    });
};

const getEventTypesList = async (): Promise<IEventType[]> => {
    const locationList = await clientApi.get('/event-type', {
        params: {
            list: true
        }
    });
    return locationList.data;
};

const deleteEvent = async (id: string): Promise<IEvent> => {
    const event = await clientApi.delete(`/event/${id}`);
    return event.data;
};

const completeEvent = async (body: {
    id: string, type: PAYMENT_TYPE,
}): Promise<IEvent> => {
    const event = await clientApi.patch(`/event/${body.id}/complete`, {
        body: body.type
    });
    return event.data;
};

export const useGetEventTypesList = () => {
    return useQuery({
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        queryKey: ["event-types-list"],
        queryFn: getEventTypesList,
        retry: 2,
    });
};

const getLicenseList = async (): Promise<IEventType[]> => {
    const locationList = await clientApi.get('/license', {
        params: {
            list: true
        }
    });
    return locationList.data;
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


const getAssetsByList = async (data: AssetsByProps): Promise<IAsset[]> => {
    const assetList = await clientApi.get('/asset', {
        params: {
            list: true, ...data
        }
    });
    return assetList.data;
};

export const useGetAssetsByList = (data: AssetsByProps) => {
    return useQuery({
        enabled: !!data?.licenseTypeId && !!data?.locationId,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        queryKey: ["asset-by-list", data?.licenseTypeId, data?.locationId],
        queryFn: () => getAssetsByList(data),
        retry: 2,
    });
};

const getInstructorList = async (): Promise<IUser[]> => {
    const userList = await clientApi.get('/user/list', {
        params: {
            isInstructor: true,
        }
    });
    return userList.data;
};

export const useGetInstructorList = () => {
    return useQuery({
        enabled: true,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        queryKey: ["instructor-list"],
        queryFn: getInstructorList,
        retry: 2,
    });
};

export const useDeleteMutation = () => {
    return useMutation({
        mutationFn: (id: string) => {
            return deleteEvent(id);
        }, mutationKey: ['event-delete'],
    });
};

export const useCompleteMutation = () => {
    return useMutation({
        mutationFn: (body: {
            id: string, type: PAYMENT_TYPE,
        }) => {
            return completeEvent(body);
        }, mutationKey: ['event-complete'],
    });
};
