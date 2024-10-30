import {Dayjs} from "dayjs";

export interface ILocation {
    id: string;
    name: string;
    status: boolean;
    createdAt: Date;
    updatedAt: Date;
    assets: IAsset[];
    events: IEvent[];
    instructors: IUser[];
}

export interface ILicenseType {
    id: string;
    name: string;
    color: string;
    createdAt: Date;
    updatedAt: Date;
    events: IEvent[];
    assets: IAsset[];
}

export interface IAsset {
    id: string;
    name: string;
    plate: string;
    status: boolean;
    createdAt: Date;
    updatedAt: Date;
    locationId: string;
    location: ILocation;
    events: IEvent[];
    licenseTypeId: string;
    licenseType: ILicenseType;
    schedule: ISchedule[];
}

export interface IUser {
    id: string;
    authId: string;
    name: string;
    locationId: string;
    createdAt: Date;
    updatedAt: Date;
    eventsAsCreator: IEvent[];
    eventsAsInstructor: IEvent[];
    logs: ILog[];
    location?: ILocation;
    access?: IUserAccess;
    schedule: ISchedule[];
}

export interface IUserAccess {
    id: string;
    admin: boolean;
    instructor: boolean;
    receptionist: boolean;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    user: IUser;
}

export interface IEvent {
    id: string;
    status: string;
    isMissingInfo: boolean;
    createdAt: Date;
    updatedAt: Date;
    assetId?: string;
    asset?: IAsset;
    createdById: string;
    createdBy: IUser;
    customerId: string;
    customer: ICustomer;
    instructorId?: string;
    instructor?: IUser;
    licenseTypeId?: string;
    licenseType?: ILicenseType;
    locationId: string;
    location: ILocation;
    paymentId: string;
    payment: IPayment;
    date?: Date;
    time: string;
    typeId: string;
    type: IEventType;
    notes?: string;
    isReferred?: boolean;
}

export interface ICustomer {
    id: string;
    name: string;
    identification: string;
    phone: string;
    testPassed?: boolean;
    createdAt: Date;
    updatedAt: Date;
    event: IEvent[];
    scheduleId: string;
    schedule: ISchedule
}

export interface ISchedule {
    id: string;
    startTime: string;
    endTime: string;
    startDate: Date;
    endDate: Date;
    createdAt: Date;
    updatedAt: Date;
    assetId?: string;
    asset?: IAsset;
    userId?: string;
    user?: IUser;
    customer?: ICustomer;
}

export interface IPayment {
    id: string;
    price?: number;
    cashAdvance?: number;
    paid?: boolean;
    paidDate?: Date;
    createdAt: Date;
    updatedAt: Date;
    event?: IEvent;
}

export interface IEventType {
    id: string;
    name: string;
    color: string;
    createdAt: Date;
    updatedAt: Date;
    events: IEvent[];
}

export interface ILog {
    id: string;
    modelName: string;
    modelId: string;
    action: string;
    changes: string;
    createdAt: Date;
    changedById: string;
    changedBy: IUser;
}

export interface IEventForm {
    id?: string;
    typeId: string;
    customer?: {
        name?: string; identification?: string; phone?: string;
        schedule?: {
            startTime?: string;
        }
    };
    locationId?: string;
    licenseTypeId: string;
    date?: string | Date | Dayjs;
    startTime?: string;
    endTime?: string;
    instructorId?: string;
    assetId?: string;
    createdById?: string;
    payment?: {
        price?: number; cashAdvance?: number; paid?: boolean;
    }
    notes?: string;
    isReferred?: boolean;
}

export interface IEventFilter {
    date: string;
    locationId: string;
    instructorId: string;
    licenseTypeId: string;
}

export enum EventStatus {
    COMPLETED = 'COMPLETED',
    DELETED = 'DELETED',
    IN_PROGRESS = 'IN_PROGRESS'
}

export enum OWNCAR {
    OWN = '33e56cb5-6581-475e-8ef1-a82bb39ae185',
}

export enum CLASS_TYPE {
    CLASS = 'a3c2df55-9f84-44c8-8b99-2ce17afb4d77',
    DRIVE_TEST = '4a008599-701e-471d-9ff2-1ad9ee8e1298'
}