import {ILicenseType, ISchool} from "@/lib/definitions";
import {clientApi} from "@/lib/clientApi";
import {useMutation, useQuery} from "react-query";
import {SchoolFormProps} from "@/app/schools/forms/SchoolForm";

const createSchool = async (data: SchoolFormProps): Promise<ISchool> => {
    const school = await clientApi.post('/school', data);
    return school.data;
};

const updateSchool = async (data: SchoolFormProps): Promise<ISchool> => {
    const school = await clientApi.patch('/school', data);
    return school.data;
};

const getSchoolById = async (id: string): Promise<ISchool> => {
    const school = await clientApi.get(`/school/${id}`);
    return school.data;
};

const getLicenseList = async (): Promise<ILicenseType[]> => {
    const licenses = await clientApi.get('license', {
        params: {
            list: true,
        }
    });
    return licenses.data;
};

const deleteSchool = async (id: string): Promise<ISchool> => {
    const school = await clientApi.delete(`/school/${id}`);
    return school.data;
};

export const useCreateMutation = () => {
    return useMutation({
        mutationFn: (data: SchoolFormProps) => {
            return createSchool(data);
        }, mutationKey: ['school-create'],
    });
};

export const useUpdateMutation = () => {
    return useMutation({
        mutationFn: (data: SchoolFormProps) => {
            return updateSchool(data);
        }, mutationKey: ['school-update'],
    });
};

export const useGetSchoolById = (id: string) => {
    return useQuery({
        enabled: true,
        refetchOnWindowFocus: false,
        queryKey: ["school-by-id", id],
        queryFn: () => getSchoolById(id),
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
            return deleteSchool(id);
        },
        mutationKey: ['school-delete'],
    });
};
