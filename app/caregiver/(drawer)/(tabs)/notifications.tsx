import { StyleSheet, TouchableOpacity, View } from "react-native";

import { FlatList } from "react-native-gesture-handler";

import { ThemedText } from "@/components/themed-text";
import { useNotification } from "@/hooks/use-notifications";
import { formatDateToMDY } from "@/utils";

export default function NotificationsScreen() {
  const { notifications } = useNotification();
  return (
    <View style={styles.container}>
      <ThemedText>Notifications</ThemedText>

      <FlatList
        data={notifications}
        renderItem={({ item, index }) => (
          <TouchableOpacity style={styles.item} key={index}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <ThemedText type="defaultSemiBold">{item.title}</ThemedText>
              <ThemedText style={{ fontSize: 11 }}>
                {formatDateToMDY(new Date()) === formatDateToMDY(item.createdAt)
                  ? "Today"
                  : formatDateToMDY(item.createdAt)}
              </ThemedText>
            </View>
            <ThemedText numberOfLines={1} ellipsizeMode="tail">
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
    justifyContent: "center",
    padding: 20,
    width: "100%",
    gap: 16,
  },
  item: {
    padding: 8,
    borderWidth: 1,
    borderRadius: 8,
  },
});
