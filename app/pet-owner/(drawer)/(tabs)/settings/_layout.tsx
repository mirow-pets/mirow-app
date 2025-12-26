import { Stack } from "expo-router";

import { defaultHeader } from "@/utils";
import "react-native-reanimated";

export default function SettingsLayout() {
  return (
    <Stack
      screenOptions={{
        header: defaultHeader,
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
        name="auto-pay"
        options={{ presentation: "modal", title: "Auto Pay" }}
      />
    </Stack>
  );
}
