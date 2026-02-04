import { Stack } from "expo-router";

import { DefaultHeader } from "@/utils";

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        header: DefaultHeader,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "My Account",
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
        name="payment-methods"
        options={{ presentation: "modal", headerShown: false }}
      />
      <Stack.Screen
        name="address"
        options={{ presentation: "modal", title: "Address" }}
      />
    </Stack>
  );
}
