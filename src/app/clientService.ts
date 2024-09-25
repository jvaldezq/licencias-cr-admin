import {IEvent, ILocation, IUser} from "@/lib/definitions";
import {clientApi} from "@/lib/clientApi";
import {useMutation, useQuery} from "react-query";
import {EventForm} from "@/app/EventsForm";

const createEvent = async (data: EventForm): Promise<IEvent> => {
    const newListing = await clientApi.post('/event', data);
    return newListing.data;
};

const updateEvent = async (data: EventForm): Promise<IEvent> => {
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

export const useCreateMutation = () => {
    return useMutation({
        mutationFn: (data: EventForm) => {
            return createEvent(data);
        },
        mutationKey: ['event-create'],
    });
};

export const useUpdateMutation = () => {
    return useMutation({
        mutationFn: (data: EventForm) => {
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