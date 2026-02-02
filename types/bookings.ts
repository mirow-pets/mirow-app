import { TCaregiver, TCaregiverQueue } from "./caregivers";
import { TPaymentStatus } from "./payments";
import { TPet } from "./pets";
import { TReview } from "./reviews";
import { TServiceType } from "./services";
import { TUser } from "./users";

export interface TBooking {
  deletedAt: Date;
  id: string;
  startDate: Date;
  transactionId: string;
  paymentIndentId: string;
  amount: number;
  tipPaymentIndentId: string;
  tips: number;
  pickup: string;
  pickupAddressText: string;
  dropupAddressText: string;
  dropOff: string;
  rejectReason: string;
  cancelReason: string;
  endDate: Date;
  isFeeding: boolean;
  serviceStartedAt: Date;
  isNotified: boolean;
  isReminder: boolean;
  notes: string;
  bookingStatusId: number;
  careGiversId: string;
  serviceTypesId: number;
  usersId: string;
  isOpenShift: boolean;
  homeTypesId: number;
  paymentStatusId: number;
  roomTypesId: number;
  mealFrequencyId: number;
  serviceDurationId: number;
  walkTypeId: number;
  trainingTypeId: number;
  transportTypeId: number;
  serviceTypes?: TServiceType;
  users?: TUser;
  pets?: TPet[];
  bookingStatus?: TBookingStatus;
  caregiversQueues: TCaregiverQueue[];
  careGivers: TCaregiver;
  reviews?: TReview;
  paymentStatus: TPaymentStatus;
}

export interface TBookingStatus {
  deletedAt: Date | null;
  id: number;
  status: string;
  display: string;
  image: string | null;
}

export interface TTrainingType {
  id: number;
  type: string;
  display: string;
}
