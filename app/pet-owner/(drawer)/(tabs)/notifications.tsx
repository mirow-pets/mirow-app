import { StyleSheet, TouchableOpacity, View } from "react-native";

import { router } from "expo-router";
import { FlatList } from "react-native-gesture-handler";

import { ThemedText } from "@/components/themed-text";
import { useNotification } from "@/hooks/use-notifications";
import { formatDateToMDY } from "@/utils";

export default function NotificationsScreen() {
  const { notifications, setNotificationAsRead } = useNotification();

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={styles.item}
            key={index}
            onPress={() => {
              setNotificationAsRead(item.id);
              router.push(`/pet-owner/bookings/${item.bookingsId}`);
            }}
          >
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <ThemedText type="defaultSemiBold">{item.title}</ThemedText>
              <ThemedText
                style={{
                  fontSize: 11,
                }}
              >
                {formatDateToMDY(new Date()) === formatDateToMDY(item.createdAt)
                  ? "Today"
                  : formatDateToMDY(item.createdAt)}
              </ThemedText>
            </View>
            <ThemedText numberOfLines={2} ellipsizeMode="tail">
              {item.description}
            </ThemedText>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
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
