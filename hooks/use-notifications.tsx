import { createContext, ReactNode, useContext } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { addQueryParams, Get, Patch } from "@/services/http-service";
import { TNotification } from "@/types";

import { useAuth } from "./use-auth";

export interface NotificationContextValues {
  notifications: TNotification[];
  isLoadingNotifications: boolean;
  setNotificationAsRead: (_notificationId: TNotification["id"]) => void;
}

export const NotificationContext =
  createContext<NotificationContextValues | null>(null);

export interface NotificationProviderProps {
  children: ReactNode;
}

const NotificationProvider = ({ children }: NotificationProviderProps) => {
  const { currUser } = useAuth();
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading: isLoadingNotifications } =
    useQuery<TNotification[], Error>({
      queryKey: ["notifications", currUser?.sessionId],
      queryFn: () =>
        Get(
          addQueryParams("/notifications", {
            filter: JSON.stringify({
              order: "createdat DESC",
            }),
          })
        ),
      enabled: !!currUser,
    });

  const { mutate: read } = useMutation<void, Error, TNotification["id"]>({
    mutationFn: (notificationId: TNotification["id"]) =>
      Patch(`/notifications/${notificationId}`, { read: true }),
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: ["notifications", currUser?.sessionId],
      });
      await queryClient.refetchQueries({
        queryKey: ["/notifications"],
      });
    },
  });

  const setNotificationAsRead = (notificationId: TNotification["id"]) =>
    read(notificationId);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        isLoadingNotifications,
        setNotificationAsRead,
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
