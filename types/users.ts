export enum UserRole {
  CareGiver = "caregiver",
  PetOwner = "pet-owner",
}

export interface TUser {
  id: string;
  firstName: string;
  lastName: string;
  sessionId: string;
  isEnableTwoStepAuthentication: boolean;
  role: UserRole;
  profileImage: string;
  email: string;
  eFirstName: string;
  eLastName: string;
  ePhone: string;
  relationshipName: string;
  phone: string;
  bioDescription?: string;
  address: TAddress[];
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
