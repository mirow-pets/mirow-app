import { createContext, ReactNode, useContext } from "react";

import { useQuery } from "@tanstack/react-query";

import { Get } from "@/services/http-service";
import { TNotification } from "@/types";

import { useAuth } from "./use-auth";

export interface NotificationContextValues {
  notifications: TNotification[];
  isLoadingNotifications: boolean;
}

export const NotificationContext =
  createContext<NotificationContextValues | null>(null);

export interface NotificationProviderProps {
  children: ReactNode;
}

const NotificationProvider = ({ children }: NotificationProviderProps) => {
  const { currUser } = useAuth();

  const { data: notifications = [], isLoading: isLoadingNotifications } =
    useQuery<TNotification[], Error>({
      queryKey: ["notifications"],
      queryFn: () => Get(`/notifications`),
      enabled: !!currUser,
    });

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        isLoadingNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;

export const useNotification = () => {
  const notification = useContext(NotificationContext);

  if (!notification) {
    throw new Error(
      "Cannot access useNotification outside NotificationProvider"
    );
  }
  return notification;
};
