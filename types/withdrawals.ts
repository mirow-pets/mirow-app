export interface TWithdrawal {
  id: string;
  stripeAccountId: string;
  userId: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt: Date;
  failureReason: string;
  stripePayoutId: string;
}
