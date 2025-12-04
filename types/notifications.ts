export interface TNotification {
  deletedAt: Date;
  id: string;
  read: true;
  cleared: boolean;
  title: string;
  description: string;
  usersId: string;
  chatThreadsId: string;
  bookingsId: string;
  createdAt: Date;
}
