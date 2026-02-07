import { Stack } from "expo-router";

import { DefaultHeader } from "@/utils";

export default function CaregiversLayout() {
  return (
    <Stack
      screenOptions={{
        header: DefaultHeader,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Caregivers",
        }}
      />
      <Stack.Screen
        name="nearby"
        options={{
          headerTitle: "Nearby Caregivers",
        }}
      />
      <Stack.Screen
        name="[userId]/index"
        options={{ presentation: "modal", title: "View Caregiver" }}
      />
    </Stack>
  );
}
