import { TPetType } from "./pets";
import { TServiceType } from "./services";
import { TAuthUser, TUser } from "./users";

export interface TCaregiver {
  usersId: string;
  acceptanceRadius: number;
  experience: number;
  pricePerHour: number;
  pricePerService: number;
  pricePerMile: number;
  averageStarRatings: number;
  totalStars: number;
  totalReviews: number;
  serviceCompleted: number;
  repeatedBookings: number;
  users: TUser;
  serviceTypes?: TServiceType[];
  careGiversServiceTypesLink?: TCareGiversServiceTypesLink[];
  petTypes?: TPetType[];
  careGiverPreferences?: TCaregiverPreference[];
  careGiverSkills?: TCaregiverSkill[];
  homeTypes?: THomeType[];
  transportType?: TTransportType[];
  distance: { text?: string };
  isFavourite: boolean;
}

export interface TAuthCaregiver extends TCaregiver {
  deletedAt: Date;
  connectedAccId: string;
  experience: number;
  totalTips: number;
  totalReviews: number;
  ssn: string;
  drivingLicense: string;
  driverLicenseState: string;
  accHolderName: string;
  accountNumber: string;
  routingNumber: string;
  reportId: string;
  candidateId: string;
  customerId: string;
  backgroundVerifyStatus: string;
  kycStatusId: number;
  users: TAuthUser;
  isBackgroundVerificationPaid: boolean;
  lat?: number;
  lng?: number;
  acceptanceRadius: number;
}

export interface TCaregiverPreference {
  deletedAt: Date;
  id: number;
  preference: string;
  image: string;
  order: number;
}

export interface TCaregiverSkill {
  deletedAt: Date;
  id: number;
  skill: string;
  image: string;
  order: number;
}

export interface TCaregiverProfileCompletion {
  percentage: number;
  isProfileImageAdded: boolean;
  isEmergencyDetailsAdded: boolean;
  isCaregiverPreferencesAdded: boolean;
  isCaregiverSkillsAdded: boolean;
  isGalleryAdded: boolean;
  isPriceAdded: boolean;
  isBackgroundVerifyStatus: boolean;
  isAddress: boolean;
  isPaymentMethod: boolean;
  isServiceArea: boolean;
}

export interface THomeType {
  deletedAt: Date;
  id: number;
  type: string;
  display: string;
  order: number;
}

export interface TDocument {
  deletedAt: Date;
  id: number;
  type: string;
  display: string;
  image: string;
  order: number;
}

export interface TTransportType {
  deletedAt: Date;
  id: number;
  type: string;
  display: string;
}

export interface TCaregiverGallery {
  id: string;
  url: string;
  caregiverId: string;
  updatedAt: Date;
  createdAt: Date;
  deletedId: Date | null;
  isDeleted: boolean;
}

export interface TCaregiverQueue {
  deletedAt: Date | null;
  id: number;
  bookingsId: string;
  careGiversId: string;
}

export interface TCareGiversServiceTypesLink {
  deletedAt: Date;
  id: number;
  serviceRate: number;
  careGiversId: string;
  serviceTypesId: number;
}

export interface TCaregiversFilter
  extends Record<
    string,
    string | string[] | number | number[] | null | undefined
  > {
  search?: string;
  price?: number;
  radius?: number;
  starrating?: number;
  caregiverPreferenceIds?: number[];
  caregiverSkillIds?: number[];
  serviceTypeIds?: number[];
  petTypeIds?: number[];
  transportTypeIds?: number[];
  homeTypeIds?: number[];
}

export type TCaregiversResponse = {
  usersId: TCaregiver["usersId"];
  acceptanceRadius: TCaregiver["acceptanceRadius"];
  experience: TCaregiver["experience"] | null;
  averageStarRatings: TCaregiver["averageStarRatings"] | null;
  totalStars: TCaregiver["totalStars"] | null;
  totalReviews: TCaregiver["totalReviews"] | 0;
  serviceCompleted: number;
  firstName: TUser["firstName"];
  lastName: TUser["lastName"];
  profileImage: TUser["profileImage"];
  distanceInMiles: number;
  services: { id: number; label: string; serviceRate: number }[];
}[];
