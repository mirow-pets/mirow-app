import { Stack } from "expo-router";

import { DefaultHeader } from "@/utils";

export default function PaymentMethodsLayout() {
  return (
    <Stack
      screenOptions={{
        header: DefaultHeader,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Cards",
        }}
      />
      <Stack.Screen
        name="add"
        options={{
          presentation: "modal",
          title: "Add Card",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
