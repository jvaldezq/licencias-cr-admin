import {IUser} from "@/lib/definitions";
import {clientApi} from "@/lib/clientApi";
import {useMutation, useQuery} from "react-query";
import {PeopleFormProps} from "@/app/people/forms/PeopleForm";

const updatePeople = async (data: PeopleFormProps): Promise<IUser> => {
    const user = await clientApi.patch(`/user/${data.id}`, data);
    return user.data;
};

const getPeopleById = async (id: number): Promise<IUser> => {
    const people = await clientApi.get(`/user/${id}`);
    return people.data;
};

export const useUpdateMutation = () => {
    return useMutation({
        mutationFn: (data: PeopleFormProps) => {
            return updatePeople(data);
        }, mutationKey: ['user-update'],
    });
};

export const useGetPeopleById = (id: number) => {
    return useQuery({
        enabled: !!id,
        cacheTime: 0,
        refetchOnWindowFocus: false,
        queryKey: ["user-by-id", id],
        queryFn: () => getPeopleById(id),
        retry: 2,
    });
};