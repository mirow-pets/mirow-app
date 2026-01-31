import { Stack } from "expo-router";

import { DefaultHeader } from "@/utils";
import "react-native-reanimated";

export default function SettingsLayout() {
  return (
    <Stack
      screenOptions={{
        header: DefaultHeader,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Settings",
        }}
      />
      <Stack.Screen
        name="change-password"
        options={{ presentation: "modal", title: "Change Password" }}
      />
      <Stack.Screen
        name="change-email"
        options={{ presentation: "modal", title: "Change Email" }}
      />
      <Stack.Screen
        name="notification-preferences"
        options={{ presentation: "modal", title: "Notification Preferences" }}
      />
      <Stack.Screen
        name="deactivate-account"
        options={{ presentation: "modal", title: "Deactivate Account" }}
      />
      <Stack.Screen
        name="auto-payout"
        options={{ presentation: "modal", title: "Auto Payout" }}
      />
    </Stack>
  );
}
