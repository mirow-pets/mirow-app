import { createContext, ReactNode, useContext, useEffect } from "react";

import {
  UseMutateFunction,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { TEnableNotification } from "@/features/notifications/validations";
import { addQueryParams, Get, Patch, Post } from "@/services/http-service";
import { TNotification } from "@/types";
import { TNotificationPreference } from "@/types/notifications";
import { registerForPushNotificationsAsync } from "@/utils";

import { useAuth } from "./use-auth";

export interface NotificationContextValues {
  notifications: TNotification[];
  isLoadingNotifications: boolean;
  setNotificationAsRead: (_notificationId: TNotification["id"]) => void;
  notificationPreferences: TNotificationPreference[];
  isLoadingNotificationPreferences: boolean;
  enableNotification: UseMutateFunction<void, Error, TEnableNotification>;
  isEnablingNotification: boolean;
}

export const NotificationContext =
  createContext<NotificationContextValues | null>(null);

export interface NotificationProviderProps {
  children: ReactNode;
}

const NotificationProvider = ({ children }: NotificationProviderProps) => {
  const { currUser, setFcmToken, logout } = useAuth();

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: (input: { token: string; sessionId: string }) =>
      Patch("/users/firebase-token", input),
    onError: () => {
      logout();
    },
  });

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
      refetchInterval: 10_000,
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

  const {
    data: notificationPreferences,
    isLoading: isLoadingNotificationPreferences,
  } = useQuery({
    queryKey: ["notification-preferences"],
    queryFn: () => Get("/notification-preferences"),
  });

  const { mutate: enableNotification, isPending: isEnablingNotification } =
    useMutation<void, Error, TEnableNotification>({
      mutationFn: (input: TEnableNotification) =>
        Post(`/enable-notification`, input),
      onSuccess: async () => {
        const queryKeys = [
          ["caregiver-profile", currUser?.sessionId],
          ["pet-owner-profile", currUser?.sessionId],
        ];

        await Promise.all(
          queryKeys.map((queryKey) =>
            queryClient.refetchQueries({
              queryKey,
            })
          )
        );
      },
    });

  const setNotificationAsRead = (notificationId: TNotification["id"]) =>
    read(notificationId);

  useEffect(() => {
    if (!currUser) return;
    registerForPushNotificationsAsync().then(async (token) => {
      if (!token || !currUser?.sessionId) return;
      mutate(
        { token, sessionId: currUser.sessionId },
        {
          onSuccess: async () => {
            await setFcmToken(token);
          },
        }
      );
    });
  }, [currUser, mutate, setFcmToken]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        isLoadingNotifications,
        setNotificationAsRead,
        notificationPreferences,
        isLoadingNotificationPreferences,
        enableNotification,
        isEnablingNotification,
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
