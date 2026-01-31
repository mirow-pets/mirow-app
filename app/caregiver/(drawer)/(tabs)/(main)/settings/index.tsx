import { StyleSheet, TouchableOpacity, View } from "react-native";

import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { FlatList } from "react-native-gesture-handler";

import { ThemedText } from "@/components/themed-text";
import { whiteColor } from "@/constants/theme";
import { useAuth } from "@/hooks/use-auth";

export default function SettingsScreen() {
  const { logout } = useAuth();
  const router = useRouter();

  const menu = [
    {
      icon: (
        <MaterialIcons name="domain-verification" size={25} color={"#525252"} />
      ),
      label: "Change password",
      isDone: true,
      onPress: () => router.push("/caregiver/settings/change-password"),
    },
    {
      icon: (
        <MaterialIcons name="domain-verification" size={25} color={"#525252"} />
      ),
      label: "Notification preferences",
      isDone: true,
      onPress: () =>
        router.push("/caregiver/settings/notification-preferences"),
    },
    {
      icon: (
        <MaterialIcons name="domain-verification" size={25} color={"#525252"} />
      ),
      label: "Change your email",
      onPress: () => router.push("/caregiver/settings/change-email"),
    },
    // {
    //   icon: (
    //     <MaterialIcons name="domain-verification" size={25} color={"#525252"} />
    //   ),
    //   label: "Two-factor authentication",
    //   onPress: () => router.push("/caregiver/pets"),
    // },
    {
      icon: (
        <MaterialIcons name="domain-verification" size={25} color={"#525252"} />
      ),
      label: "Auto payout",
      onPress: () => router.push("/caregiver/settings/auto-payout"),
    },
    {
      icon: (
        <MaterialIcons name="domain-verification" size={25} color={"#525252"} />
      ),
      label: "Deactivate Account",
      onPress: () => router.push("/caregiver/settings/deactivate-account"),
    },
    {
      icon: (
        <MaterialIcons name="domain-verification" size={25} color={"#525252"} />
      ),
      label: "Logout",
      onPress: logout,
    },
  ];

  return (
    <View style={styles.container}>
      <FlatList
        scrollEnabled={true}
        data={menu}
        contentContainerStyle={{ gap: 8 }}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity
              key={index}
              style={styles.itemContainer}
              onPress={item.onPress}
            >
              {item.icon}
              <ThemedText>{item.label}</ThemedText>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    width: "100%",
    gap: 8,
    backgroundColor: whiteColor,
    flex: 1,
  },
  itemContainer: {
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    borderWidth: 1,
    borderRadius: 8,
  },
});
