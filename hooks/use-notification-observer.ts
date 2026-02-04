import { useEffect } from "react";
import { Platform } from "react-native";

import * as Notifications from "expo-notifications";
import { Href, router } from "expo-router";

export const useNotificationObserver = () => {
  useEffect(() => {
    // Notifications APIs are not available on web; no-op in that environment.
    if (Platform.OS === "web") {
      return;
    }

    const redirect = (notification: Notifications.Notification) => {
      const url = notification.request.content.data?.url;
      if (typeof url === "string") {
        router.push(url as Href);
      }
    };

    const response = Notifications.getLastNotificationResponse();
    if (response?.notification) {
      redirect(response.notification);
    }

    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        redirect(response.notification);
      }
    );

    return () => {
      subscription.remove();
    };
  }, []);
};
