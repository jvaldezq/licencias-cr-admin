import {Dayjs} from "dayjs";

export interface ILocation {
    id: number;
    name: string;
    status: boolean;
    createdAt: Date;
    updatedAt: Date;
    assets: IAsset[];
    events: IEvent[];
    instructors: IUser[];
}

export interface ILicenseType {
    id: number;
    name: string;
    color: string;
    createdAt: Date;
    updatedAt: Date;
    events: IEvent[];
    assets: IAsset[];
}

export interface IAsset {
    id: number;
    name: string;
    plate: string;
    status: boolean;
    createdAt: Date;
    updatedAt: Date;
    locationId: number;
    location: ILocation;
    events: IEvent[];
    licenseTypeId: number;
    licenseType: ILicenseType;
    schedule: ISchedule[];
}

export interface IUser {
    id: number;
    authId: string;
    name: string;
    locationId: number;
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
    id: number;
    admin: boolean;
    instructor: boolean;
    receptionist: boolean;
    userId: number;
    createdAt: Date;
    updatedAt: Date;
    user: IUser;
}

export interface IEvent {
    id: number;
    status: string;
    isMissingInfo: boolean;
    createdAt: Date;
    updatedAt: Date;
    assetId?: number;
    asset?: IAsset;
    createdById: number;
    createdBy: IUser;
    customerId: number;
    customer: ICustomer;
    instructorId?: number;
    instructor?: IUser;
    licenseTypeId?: number;
    licenseType?: ILicenseType;
    locationId: number;
    location: ILocation;
    paymentId: number;
    payment: IPayment;
    date?: Date;
    time: string;
    typeId: number;
    type: IEventType;
}

export interface ICustomer {
    id: number;
    name: string;
    identification: string;
    phone: string;
    testPassed?: boolean;
    createdAt: Date;
    updatedAt: Date;
    event: IEvent[];
    scheduleId: number;
    schedule: ISchedule
}

export interface ISchedule {
    id: number;
    startTime: string;
    endTime: string;
    startDate: Date;
    endDate: Date;
    createdAt: Date;
    updatedAt: Date;
    assetId?: number;
    asset?: IAsset;
    userId?: number;
    user?: IUser;
    customer?: ICustomer;
}

export interface IPayment {
    id: number;
    price?: number;
    cashAdvance?: number;
    paid?: boolean;
    paidDate?: Date;
    createdAt: Date;
    updatedAt: Date;
    event?: IEvent;
}

export interface IEventType {
    id: number;
    name: string;
    color: string;
    createdAt: Date;
    updatedAt: Date;
    events: IEvent[];
}

export interface ILog {
    id: number;
    modelName: string;
    modelId: number;
    action: string;
    changes: string;
    createdAt: Date;
    changedById: number;
    changedBy: IUser;
}

export interface IEventForm {
    id?: number;
    typeId: number;
    customer?: {
        name?: string; identification?: string; phone?: string;
        schedule?: {
            startTime?: string;
        }
    };
    locationId?: number;
    licenseTypeId: number;
    date?: string | Date | Dayjs;
    startTime?: string;
    endTime?: string;
    instructorId?: number;
    assetId?: number;
    createdById?: number;
    payment?: {
        price?: number; cashAdvance?: number; paid?: boolean;
    }
}

export interface IEventFilter {
    date: string;
    locationId: number;
    instructorId: number;
    licenseTypeId: number;
}

export enum EventStatus {
    COMPLETED = 'COMPLETED',
    DELETED = 'DELETED',
    IN_PROGRESS = 'IN_PROGRESS'
}

export enum OWNCAR {
    OWN = 9999,
}

export enum CLASS_TYPE {
    CLASS = 1,
    DRIVE_TEST = 2
}