export interface TReview {
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  deletedAt: Date | null;
  id: string;
  feedback: string | null;
  starrating: number;
  careGiversId: string;
  usersId: string;
  serviceTypesId: number;
  bookingsId: string;
}
