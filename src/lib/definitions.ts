export interface ILocation {
    id: number;
    name: string;
    status: boolean;
    createdAt: Date;
    updatedAt: Date;
    assets: IAsset[];
    instructors: IUser[];
    events: IEvent[];
}

export interface ILicenseType {
    id: number;
    name: string;
    color: string;
    createdAt: Date;
    updatedAt: Date;
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
}

export interface IUser {
    id: number;
    authId: string;
    name: string;
    color: string;
    locationId: number;
    createdAt: Date;
    updatedAt: Date;
    eventsAsInstructor: IEvent[];
    eventsAsCreator: IEvent[];
    access?: IUserAccess;
    location: ILocation;
    logs: ILog[];
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
    createdAt: Date;
    updatedAt: Date;
    instructorId?: number;
    instructor?: IUser;
    createdById: number;
    createdBy?: IUser;
    locationId: number;
    location: ILocation;
    typeId: number;
    type: IEventType;
    assetId?: number;
    asset?: IAsset;
    scheduleId: number;
    schedule: ISchedule;
    paymentId: number;
    payment: IPayment;
    customerId: number;
    customer: ICustomer;
    isMissingInfo: boolean;
}

export interface ICustomer {
    id: number;
    name: string;
    identification: string;
    phone: string;
    testPassed?: boolean;
    createdAt: Date;
    updatedAt: Date;
    event?: IEvent;
}

export interface ISchedule {
    id: number;
    eventStartDate: Date;
    eventEndDate: Date;
    instructorStartDate: Date;
    instructorEndDate: Date;
    assetStartDate: Date;
    assetEndDate: Date;
    createdAt: Date;
    updatedAt: Date;
    event?: IEvent;
}

export interface IPayment {
    id: number;
    price?: number;
    cashAdvance?: number;
    paid: boolean;
    paidDate: Date;
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
    changedById: number;
    changedBy: IUser;
    createdAt: Date;
}

export interface IEventForm {
    type: number;
    customer: {
        name: string;
        identification: string;
        phone: string;
    };
    payment: {
        price?: number;
        cashAdvance?: number;
        paid: boolean;
    }
    schedule: {
        eventStartDate: Date;
        eventEndDate: Date;
        instructorStartDate?: Date;
        instructorEndDate?: Date;
        assetStartDate?: Date;
        assetEndDate?: Date;
    }
    locationId: number;
    assetId?: number;
    licenseTypeId: number;
    instructorId?: number;
    createdById?: number;
}