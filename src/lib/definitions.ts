import { Dayjs } from 'dayjs';

export interface ILocation {
  id: string;
  name: string;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
  assets: IAsset[];
  events: IEvent[];
  instructors: IUser[];
  prices: IPrice[];
}

export interface ILicenseType {
  id: string;
  name: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
  events: IEvent[];
  assets: IAsset[];
  schoolPrices: ISchoolPrices[];
  prices: IPrice[];
}

export interface IAsset {
  id: string;
  name: string;
  plate: string;
  status: boolean;
  locationId: string;
  location: ILocation;
  events: IEvent[];
  licenseTypeId: string;
  licenseType: ILicenseType;
  schedule: ISchedule[];
  note: string;
  coolantDate: Date;
  oilDate: Date;
  createdAt: Date;
  updatedAt: Date;
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
  cashPaymentsAdvance: ICashPaymentsAdvance[];
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
  hasMedical?: boolean;
  isExternalReferred?: boolean;
  isInternalReferred?: boolean;
  schoolId?: string;
  school?: ISchool;
  hasBeenContacted?: boolean;
  noShow?: boolean;
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
  schedule: ISchedule;
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
  paidDate?: Date;
  cashPaymentsAdvance?: ICashPaymentsAdvance[];
  createdAt: Date;
  updatedAt: Date;
  event?: IEvent;
}

export interface ICashPaymentsAdvance {
  id: string;
  amount?: number;
  type?: number;
  userId?: string;
  user?: IUser;
  paymentId?: string;
  payment?: IPayment;
  createdAt: Date;
  updatedAt: Date;
}

export interface IEventType {
  id: string;
  name: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
  events: IEvent[];
}

export interface ISchool {
  id: string;
  name: string;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
  schoolPrices: ISchoolPrices[];
}

export interface ISchoolPrices {
  id: string;
  internalPrice: string;
  externalPrice: string;
  createdAt: Date;
  updatedAt: Date;
  schoolId: string;
  school: ISchool;
  licenseTypeId: string;
  licenseType: ILicenseType;
}

export interface ILog {
  id: string;
  title: string;
  message: string;
  assetId: string;
  asset: IAsset;
  eventId: string;
  event: IEvent;
  createdAt: Date;
  changedById: string;
  changedBy: IUser;
}

export interface IEventForm {
  id?: string;
  typeId: string;
  customer?: {
    name?: string;
    identification?: string;
    phone?: string;
    schedule?: {
      startTime?: string;
    };
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
    price?: number;
    cashAdvance?: number;
    type?: PAYMENT_TYPE;
  };
  notes?: string;
  hasMedical?: boolean;
  isExternalReferred?: boolean;
  isInternalReferred?: boolean;
}

export interface IEventFilter {
  date: string;
  locationId: string;
  instructorId: string;
  licenseTypeId: string;
  searchTerm: string;
}

export interface IAssetFilter {
  locationId: string;
  licenseTypeId: string;
}

export interface IPriceFilter {
  locationId: string;
}

export interface ITask {
  id: string;
  title?: string;
  status?: string;
  assetId?: string;
  asset?: IAsset;
  locationId?: string;
  location?: ILocation;
  date?: string;
  notes?: string;
  log?: ILog[];
  assignedToId?: string;
  assignedTo?: IUser;
  createdById?: string;
  createdBy?: IUser;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITask {
  id: string;
  name?: string;
  businessName?: string;
  phone?: string;
  status?: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISupplier {
  id: string;
  name?: string;
  businessName?: string;
  phone?: string;
  status?: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPrice {
  id: string;
  title?: string;
  note?: string;
  price?: number;
  offerPrice?: number;
  offerEndDate: Date;
  licenseTypeId?: string;
  licenseType?: ILicenseType;
  locationId?: string;
  location?: ILocation;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBasePrice {
  id: string;
  note: string;
  description: string;
  priceClient: number;
  priceSchool: number;
  locationId?: string;
  location?: ILocation;
  createdAt: Date;
  updatedAt: Date;
}

export enum EventStatus {
  COMPLETED = 'COMPLETED',
  PRACTICING = 'PRACTICING',
  DELETED = 'DELETED',
  PENDING = 'PENDING',
  NO_SHOW = 'NO_SHOW',
}

export enum OWNCAR {
  OWN = '33e56cb5-6581-475e-8ef1-a82bb39ae185',
}

export enum CLASS_TYPE {
  CLASS = 'a3c2df55-9f84-44c8-8b99-2ce17afb4d77',
  DRIVE_TEST = '4a008599-701e-471d-9ff2-1ad9ee8e1298',
}

export enum PAYMENT_TYPE {
  CASH = 'CASH',
  CARD = 'CARD',
  SINPE = 'SINPE',
}

export enum LOG_TITLES {
  CREATED = 'CREATED',
  DELETED = 'DELETED',
  UPDATED = 'UPDATED',
}
export const LOG_TITLES_TRANSLATED: { [key in LogTitleKeys]: string } = {
  CREATED: 'Creación',
  DELETED: 'Eliminación',
  UPDATED: 'Actualización',
};

export type LogTitleKeys = 'CREATED' | 'UPDATED' | 'DELETED';

export enum TaskStatus {
  COMPLETED = 'COMPLETED',
  DELETED = 'DELETED',
  PENDING = 'PENDING',
}
