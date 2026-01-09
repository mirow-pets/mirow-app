import { StyleSheet, TouchableOpacity, View } from "react-native";

import { Href, router } from "expo-router";

import { InfiniteFlatList } from "@/components/list/InfiniteFlatList";
import { ThemedText } from "@/components/themed-text";
import { redColor, whiteColor } from "@/constants/theme";
import { useAuth } from "@/hooks/use-auth";
import { useNotification } from "@/hooks/use-notifications";
import { TNotification, UserRole } from "@/types";
import { formatDateToMDY } from "@/utils";

export const Notifications = () => {
  const { setNotificationAsRead } = useNotification();
  const { userRole } = useAuth();

  const handleView = (notification: TNotification) => () => {
    setNotificationAsRead(notification.id);
    let href;

    if (notification.title.includes("Withdrawal"))
      href = `/${userRole as UserRole}/my-earnings/withdrawals`;
    if (notification.bookingsId)
      href = `/${userRole as UserRole}/bookings/${notification.bookingsId}`;
    if (notification.chatThreadsId)
      href = `/${userRole as UserRole}/messages/${notification.chatThreadsId}`;

    if (href) router.replace(href as Href);
  };

  return (
    <View style={styles.container}>
      <InfiniteFlatList<TNotification>
        url="/notifications"
        perPage={5}
        contentContainerStyle={[styles.listContainer, { paddingBottom: 100 }]}
        style={{ height: 400 }}
        order="createdat DESC"
        refetchInterval={10_000}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={styles.item}
            key={index}
            onPress={handleView(item)}
          >
            <View style={{ flexDirection: "row", gap: 8 }}>
              <ThemedText type="defaultSemiBold" style={{ flex: 1 }}>
                {item.title}
              </ThemedText>
              <ThemedText
                style={{
                  fontSize: 11,
                }}
              >
                {formatDateToMDY(new Date()) === formatDateToMDY(item.createdAt)
                  ? "Today"
                  : formatDateToMDY(item.createdAt)}
              </ThemedText>
              {!item.read && (
                <View
                  style={{
                    height: 8,
                    width: 8,
                    backgroundColor: redColor,
                    borderRadius: 4,
                  }}
                ></View>
              )}
            </View>
            {/* <ThemedText numberOfLines={2} ellipsizeMode="tail">
              {item.description}
            </ThemedText> */}
            <ThemedText>{item.description}</ThemedText>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    paddingTop: 20,
    backgroundColor: whiteColor,
  },
  listContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  item: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "#ffffff10",
  },
});
