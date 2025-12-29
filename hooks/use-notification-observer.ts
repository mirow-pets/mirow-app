import { useEffect } from "react";

import * as Notifications from "expo-notifications";
import { Href, router } from "expo-router";

export const useNotificationObserver = () => {
  useEffect(() => {
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
