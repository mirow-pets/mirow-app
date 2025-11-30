import { TPetType } from "./pets";
import { TServiceType } from "./services";
import { TUser } from "./users";

export interface TCaregiver {
  deletedAt: Date;
  usersId: string;
  acceptanceRadius: number;
  connectedAccId: string;
  experience: number;
  pricePerHour: number;
  pricePerService: number;
  pricePerMile: number;
  averageStarRatings: number;
  totalStars: number;
  totalTips: number;
  totalReviews: number;
  serviceCompleted: number;
  repeatedBookings: number;
  day: number;
  month: number;
  year: number;
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
  users: TUser;
  serviceTypes?: TServiceType[];
  petTypes?: TPetType[];
  careGiverPreferences?: TCaregiverPreference[];
  careGiverSkills?: TCaregiverSkill[];
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
