import {IEvent, IEventForm, IEventType, ILocation, IUser} from "@/lib/definitions";
import {clientApi} from "@/lib/clientApi";
import {useMutation, useQuery} from "react-query";

const createEvent = async (data: IEventForm): Promise<IEvent> => {
    const newListing = await clientApi.post('/event', data);
    return newListing.data;
};

const updateEvent = async (data: IEventForm): Promise<IEvent> => {
    const newListing = await clientApi.patch('/event', data);
    return newListing.data;
};

const getEventById = async (id: number): Promise<IEvent> => {
    const event = await clientApi.get(`/event/${id}`);
    return event.data;
};

const getLocationList = async (): Promise<ILocation[]> => {
    const locationList = await clientApi.get('/location', {
        params: {
            list: true
        }
    });
    return locationList.data;
};

const getInstructorListByLocationId = async (id: number): Promise<IUser[]> => {
    const userList = await clientApi.get('/user/list', {
        params: {
            isInstructor: true,
            locationId: id
        }
    });
    return userList.data;
};

const getEventTypesList = async (): Promise<IEventType[]> => {
    const locationList = await clientApi.get('/event-type', {
        params: {
            list: true
        }
    });
    return locationList.data;
};

const getLicenseList = async (): Promise<IEventType[]> => {
    const locationList = await clientApi.get('/license', {
        params: {
            list: true
        }
    });
    return locationList.data;
};

export const useCreateMutation = () => {
    return useMutation({
        mutationFn: (data: IEventForm) => {
            return createEvent(data);
        },
        mutationKey: ['event-create'],
    });
};

export const useUpdateMutation = () => {
    return useMutation({
        mutationFn: (data: IEventForm) => {
            return updateEvent(data);
        },
        mutationKey: ['event-update'],
    });
};

export const useGetEventById = (id: number) => {
    return useQuery({
        enabled: !!id,
        refetchOnWindowFocus: false,
        queryKey: ["event-by-id", id],
        queryFn: () => getEventById(id),
        retry: 2,
    });
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

export const useGetInstructorListByLocationId = (id: number) => {
    return useQuery({
        enabled: !!id,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        queryKey: ["instructor-list", id],
        queryFn: () => getInstructorListByLocationId(id),
        retry: 2,
    });
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

export const useGetLicenseList = () => {
    return useQuery({
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        queryKey: ["license-list"],
        queryFn: getLicenseList,
        retry: 2,
    });
};
