import { TUserNotificationPreference } from "./notifications";

export enum UserRole {
  CareGiver = "caregiver",
  PetOwner = "pet-owner",
}

export enum Gender {
  Male = "MALE",
  Female = "FEMALE",
  Others = "NON_BINARY",
}

export interface TUser {
  id: string;
  firstName: string;
  lastName: string;
  profileImage: string;
  email: string;
  phone: string;
  bioDescription?: string;
  address: TAddress[];
}

export interface TAuthUser extends TUser {
  isEnableTwoStepAuthentication: boolean;
  sessionId: string;
  role: UserRole;
  eFirstName: string;
  eLastName: string;
  ePhone: string;
  relationshipName: string;
  notificationPreferences: TUserNotificationPreference[];
  isAutoPayout: boolean;
  dateOfBirth: Date;
}

export interface TCurrentUser {
  firstName: string;
  lastName: string;
  activated: boolean;
  sessionId: string;
}

export interface TAddress {
  address: string;
  addressTypesId: string;
  city: string;
  country: string;
  postalCode: string;
  state: string;
}
