import {ILicenseType, ILocation} from "@/lib/definitions";
import {clientApi} from "@/lib/clientApi";
import {useMutation, useQuery} from "react-query";
import {LicenseForm} from "@/app/licenses/LicenseForm";

const createLocation = async (data: LicenseForm): Promise<ILicenseType> => {
    const license = await clientApi.post('/license', data);
    return license.data;
};

const updateLocation = async (data: LicenseForm): Promise<ILicenseType> => {
    const license = await clientApi.patch('/license', data);
    return license.data;
};

const getLicenseById = async (id: number): Promise<ILicenseType> => {
    const location = await clientApi.get(`/license/${id}`);
    return location.data;
};

export const useCreateMutation = () => {
    return useMutation({
        mutationFn: (data: LicenseForm) => {
            return createLocation(data);
        }, mutationKey: ['license-create'],
    });
};

export const useUpdateMutation = () => {
    return useMutation({
        mutationFn: (data: LicenseForm) => {
            return updateLocation(data);
        }, mutationKey: ['license-update'],
    });
};

export const useGetLicenseById = (id: number) => {
    return useQuery({
        enabled: !!id,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        queryKey: ["license-by-id", id],
        queryFn: () => getLicenseById(id),
        retry: 2,
    });
};