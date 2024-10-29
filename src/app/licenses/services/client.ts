import {ILicenseType} from "@/lib/definitions";
import {clientApi} from "@/lib/clientApi";
import {useMutation, useQuery} from "react-query";
import {LicenseFormProps} from "@/app/licenses/forms/LicenseForm";

const createLocation = async (data: LicenseFormProps): Promise<ILicenseType> => {
    const license = await clientApi.post('/license', data);
    return license.data;
};

const updateLocation = async (data: LicenseFormProps): Promise<ILicenseType> => {
    const license = await clientApi.patch('/license', data);
    return license.data;
};

const getLicenseById = async (id: string): Promise<ILicenseType> => {
    const license = await clientApi.get(`/license/${id}`);
    return license.data;
};

const deleteLicense = async (id: string): Promise<ILicenseType> => {
    const license = await clientApi.delete(`/license/${id}`);
    return license.data;
};

export const useCreateMutation = () => {
    return useMutation({
        mutationFn: (data: LicenseFormProps) => {
            return createLocation(data);
        }, mutationKey: ['license-create'],
    });
};

export const useUpdateMutation = () => {
    return useMutation({
        mutationFn: (data: LicenseFormProps) => {
            return updateLocation(data);
        }, mutationKey: ['license-update'],
    });
};

export const useGetLicenseById = (id: string) => {
    return useQuery({
        enabled: !!id,
        cacheTime: 0,
        refetchOnWindowFocus: false,
        queryKey: ["license-by-id", id],
        queryFn: () => getLicenseById(id),
        retry: 2,
    });
};

export const useDeleteMutation = () => {
    return useMutation({
        mutationFn: (id: string) => {
            return deleteLicense(id);
        },
        mutationKey: ['license-delete'],
    });
};