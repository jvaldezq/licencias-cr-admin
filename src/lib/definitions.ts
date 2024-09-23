export interface ILocation {
    id: bigint;
    name: string;
    status: boolean;
    createdAt: Date;
    updatedAt: Date;
    assets: IAsset[];
    instructors: IUser[];
    events: IEvent[];
}

export interface ILicenseType {
    id: bigint;
    name: string;
    color: string;
    createdAt: Date;
    updatedAt: Date;
    assets: ILicenseTypeOnAsset[];
}

export interface IAsset {
    id: bigint;
    name: string;
    plate: string;
    status: boolean;
    locationId: bigint;
    createdAt: Date;
    updatedAt: Date;
    licenseTypes: ILicenseTypeOnAsset[];
    location: ILocation;
}

export interface ILicenseTypeOnAsset {
    licenseType: ILicenseType;
    licenseTypeId: bigint;
    asset: IAsset;
    assetId: bigint;
    createdAt: Date;
    updatedAt: Date;
}

export interface IUser {
    id: bigint;
    authId: string;
    name: string;
    color: string;
    locationId: bigint;
    createdAt: Date;
    updatedAt: Date;
    eventsAsInstructor: IEvent[];
    eventsAsCreator: IEvent[];
    access?: IUserAccess;
    location: ILocation;
    logs: Log[];
}

export interface IUserAccess {
    id: bigint;
    admin: boolean;
    instructor: boolean;
    receptionist: boolean;
    userId: bigint;
    createdAt: Date;
    updatedAt: Date;
    user: IUser;
}

export interface IEvent {
    id: bigint;
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
    locationId: bigint;
    createdAt: Date;
    updatedAt: Date;
    instructor?: IUser;
    instructorId: bigint;
    createdBy?: IUser;
    createdById: bigint;
    location: ILocation;
}

export interface Log {
    id: bigint;
    modelName: string;
    modelId: bigint;
    action: string;
    changes: string;
    changedById: bigint;
    changedBy: IUser;
    createdAt: Date;
}
