import { StyleSheet, TouchableOpacity, View } from "react-native";

import { router } from "expo-router";

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

  return (
    <View style={styles.container}>
      <InfiniteFlatList<TNotification>
        url="/notifications"
        perPage={5}
        contentContainerStyle={[styles.listContainer, { paddingBottom: 100 }]}
        style={{ height: 400 }}
        order="createdat DESC"
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={styles.item}
            key={index}
            onPress={() => {
              setNotificationAsRead(item.id);
              router.replace(
                `/${userRole as UserRole}/bookings/${item.bookingsId}`
              );
            }}
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
