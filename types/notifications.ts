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

export interface TNotificationPreference {
  deletedAt: Date;
  id: number;
  preference: string;
  image: string;
  display: string;
}

export interface TUserNotificationPreference {
  id: number;
  notificationPreferencesId: number;
  isEnable: boolean;
}
