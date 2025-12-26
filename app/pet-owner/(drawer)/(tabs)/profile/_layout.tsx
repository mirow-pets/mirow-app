import { Stack } from "expo-router";

import { defaultHeader } from "@/utils";
import "react-native-reanimated";

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        header: defaultHeader,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "My Profile",
        }}
      />
      <Stack.Screen
        name="fullname"
        options={{ presentation: "modal", title: "Fullname" }}
      />
      <Stack.Screen
        name="phone"
        options={{ presentation: "modal", title: "Phone" }}
      />
      <Stack.Screen
        name="emergency-contact"
        options={{ presentation: "modal", title: "Emergency Contact" }}
      />
      <Stack.Screen
        name="banks"
        options={{ presentation: "modal", title: "Payment Methods" }}
      />
      <Stack.Screen
        name="address"
        options={{ presentation: "modal", title: "Address" }}
      />
    </Stack>
  );
}
