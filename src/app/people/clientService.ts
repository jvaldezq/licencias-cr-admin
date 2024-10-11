import {IUser} from "@/lib/definitions";
import {clientApi} from "@/lib/clientApi";
import {useMutation, useQuery} from "react-query";
import {PeopleForm} from "@/app/people/PeopleForm";

const createPeople = async (data: PeopleForm): Promise<IUser> => {
    const user = await clientApi.post('/user', data);
    return user.data;
};

const updatePeople = async (data: PeopleForm): Promise<IUser> => {
    const user = await clientApi.patch(`/user/${data.id}`, data);
    return user.data;
};

const getPeopleById = async (id: number): Promise<IUser> => {
    const people = await clientApi.get(`/user/${id}`);
    return people.data;
};

export const useCreateMutation = () => {
    return useMutation({
        mutationFn: (data: PeopleForm) => {
            return createPeople(data);
        }, mutationKey: ['user-create'],
    });
};

export const useUpdateMutation = () => {
    return useMutation({
        mutationFn: (data: PeopleForm) => {
            return updatePeople(data);
        }, mutationKey: ['user-update'],
    });
};

export const useGetPeopleById = (id: number) => {
    return useQuery({
        refetchOnWindowFocus: false,
        queryKey: ["user-by-id", id],
        queryFn: () => getPeopleById(id),
        retry: 2,
    });
};