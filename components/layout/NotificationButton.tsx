import { useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";

import { Colors, tertiary } from "@/constants/theme";
import { useNotification } from "@/hooks/use-notifications";
import { UserRole } from "@/types";

interface NotificationButtonProps {
  userRole: string;
}

export const NotificationButton = ({ userRole }: NotificationButtonProps) => {
  const { notifications } = useNotification();
  const colorScheme = "light";

  const count = useMemo(
    () => notifications.filter((notification) => !notification.read).length,
    [notifications]
  );

  return (
    <TouchableOpacity
      onPress={() => router.push(`/${userRole as UserRole}/notifications`)}
      style={[
        styles.button,
        { backgroundColor: Colors[colorScheme ?? "light"].background },
      ]}
    >
      <FontAwesome
        name="bell"
        size={16}
        color={Colors[colorScheme ?? "light"].text}
      />
      {count > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{count}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 4,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  badge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: tertiary,
    borderRadius: 20,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
});
