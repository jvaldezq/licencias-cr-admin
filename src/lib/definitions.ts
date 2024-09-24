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
    assets: ILicenseTypeOnAsset[];
}

export interface IAsset {
    id: number;
    name: string;
    plate: string;
    status: boolean;
    locationId: number;
    createdAt: Date;
    updatedAt: Date;
    licenseTypes: ILicenseTypeOnAsset[];
    location: ILocation;
}

export interface ILicenseTypeOnAsset {
    licenseType: ILicenseType;
    licenseTypeId: number;
    asset: IAsset;
    assetId: number;
    createdAt: Date;
    updatedAt: Date;
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
    logs: Log[];
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
    customerName: string;
    customerId: string;
    phone: string;
    price?: number;
    cashAdvance?: number;
    date: Date;
    endDate: Date;
    customerPass: boolean;
    paid: boolean;
    customerPaidDate: Date;
    status: string;
    locationId: number;
    createdAt: Date;
    updatedAt: Date;
    instructor?: IUser;
    instructorId: number;
    createdBy?: IUser;
    createdById: number;
    location: ILocation;
}

export interface Log {
    id: number;
    modelName: string;
    modelId: number;
    action: string;
    changes: string;
    changedById: number;
    changedBy: IUser;
    createdAt: Date;
}
