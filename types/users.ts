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
}
