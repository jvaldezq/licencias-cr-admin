import {
  IAsset,
  IEvent,
  IEventForm,
  IEventType,
  ILocation,
  IUser,
  PAYMENT_TYPE,
} from '@/lib/definitions';
import { clientApi } from '@/lib/clientApi';
import { useMutation, useQuery } from 'react-query';
import { AssetsByProps } from '@/app/events/services/types';

interface IEventCompleteForm {
  testPassed: boolean;
  id: string;
}

const createEvent = async (data: IEventForm): Promise<IEvent> => {
  const event = await clientApi.post('/event', data);
  return event.data;
};

const completeEvent = async (data: IEventCompleteForm): Promise<IEvent> => {
  const event = await clientApi.patch(`/event/${data.id}/complete`, data);
  return event.data;
};

export const useCreateMutation = () => {
  return useMutation({
    mutationFn: (data: IEventForm) => {
      return createEvent(data);
    },
    mutationKey: ['event-create'],
  });
};

export const useCompleteMutation = () => {
  return useMutation({
    mutationFn: (data: IEventCompleteForm) => {
      return completeEvent(data);
    },
    mutationKey: ['event-complete'],
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
    },
    mutationKey: ['event-update'],
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
    queryKey: ['event-by-id', id],
    queryFn: () => getEventById(id),
    retry: 2,
  });
};

const getLocationList = async (): Promise<ILocation[]> => {
  const locationList = await clientApi.get('/location', {
    params: {
      list: true,
    },
  });
  return locationList.data;
};

export const useGetLocationList = () => {
  return useQuery({
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    queryKey: ['location-list'],
    queryFn: getLocationList,
    retry: 2,
  });
};

const getInstructorListByLocationId = async (id: string): Promise<IUser[]> => {
  const userList = await clientApi.get('/user/list', {
    params: {
      isInstructor: true,
      locationId: id,
    },
  });
  return userList.data;
};

export const useGetInstructorListByLocationId = (id: string) => {
  return useQuery({
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    queryKey: ['instructor-list', id],
    queryFn: () => getInstructorListByLocationId(id),
    retry: 2,
  });
};

const getEventTypesList = async (): Promise<IEventType[]> => {
  const locationList = await clientApi.get('/event-type', {
    params: {
      list: true,
    },
  });
  return locationList.data;
};

const deleteEvent = async (id: string): Promise<IEvent> => {
  const event = await clientApi.delete(`/event/${id}`);
  return event.data;
};

const practicingEvent = async (id: string): Promise<IEvent> => {
  const event = await clientApi.patch(`/event/${id}/practicing`);
  return event.data;
};

const noShowEvent = async (id: string): Promise<IEvent> => {
  const event = await clientApi.patch(`/event/${id}/no-show`);
  return event.data;
};

const confirmationEvent = async (id: string): Promise<IEvent> => {
  const event = await clientApi.patch(`/event/${id}/confirmation`);
  return event.data;
};

const handlePayment = async (body: {
  id: string;
  type: PAYMENT_TYPE;
  amount: number;
  user: IUser;
}): Promise<IEvent> => {
  const event = await clientApi.patch(`/event/${body.id}/payment`, {
    body: body,
  });
  return event.data;
};

export const useGetEventTypesList = () => {
  return useQuery({
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    queryKey: ['event-types-list'],
    queryFn: getEventTypesList,
    retry: 2,
  });
};

const getLicenseList = async (): Promise<IEventType[]> => {
  const locationList = await clientApi.get('/license', {
    params: {
      list: true,
    },
  });
  return locationList.data;
};

export const useGetLicenseList = () => {
  return useQuery({
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    queryKey: ['license-list'],
    queryFn: getLicenseList,
    retry: 2,
  });
};

const getAssetsByList = async (data: AssetsByProps): Promise<IAsset[]> => {
  const assetList = await clientApi.get('/asset', {
    params: {
      list: true,
      ...data,
    },
  });
  return assetList.data;
};

export const useGetAssetsByList = (data: AssetsByProps) => {
  return useQuery({
    enabled: !!data?.licenseTypeId && !!data?.locationId,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    queryKey: ['asset-by-list', data?.licenseTypeId, data?.locationId],
    queryFn: () => getAssetsByList(data),
    retry: 2,
  });
};

const getInstructorList = async (): Promise<IUser[]> => {
  const userList = await clientApi.get('/user/list', {
    params: {
      isInstructor: true,
    },
  });
  return userList.data;
};

export const useGetInstructorList = () => {
  return useQuery({
    enabled: true,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    queryKey: ['instructor-list'],
    queryFn: getInstructorList,
    retry: 2,
  });
};

export const useDeleteMutation = () => {
  return useMutation({
    mutationFn: (id: string) => {
      return deleteEvent(id);
    },
    mutationKey: ['event-delete'],
  });
};

export const usePracticingMutation = () => {
  return useMutation({
    mutationFn: (id: string) => {
      return practicingEvent(id);
    },
    mutationKey: ['event-practicing'],
  });
};

export const useNoShowMutation = () => {
  return useMutation({
    mutationFn: (id: string) => {
      return noShowEvent(id);
    },
    mutationKey: ['event-no-show'],
  });
};

export const useConfirmationMutation = () => {
  return useMutation({
    mutationFn: (id: string) => {
      return confirmationEvent(id);
    },
    mutationKey: ['event-confirmation'],
  });
};

export const usePaymentMutation = () => {
  return useMutation({
    mutationFn: (body: {
      id: string;
      type: PAYMENT_TYPE;
      amount: number;
      user: IUser;
    }) => {
      return handlePayment(body);
    },
    mutationKey: ['event-payment'],
  });
};
