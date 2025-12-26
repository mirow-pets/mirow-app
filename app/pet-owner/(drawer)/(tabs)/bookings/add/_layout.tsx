import { Stack } from "expo-router";

import { defaultHeader } from "@/utils";
import "react-native-reanimated";

export default function AddBookingLayout() {
  return (
    <Stack
      screenOptions={{
        header: defaultHeader,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          presentation: "modal",
          headerTitle: "Add Booking",
        }}
      />
      <Stack.Screen
        name="caregivers/[userId]/index"
        options={{ presentation: "modal", title: "View Caregiver" }}
      />
    </Stack>
  );
}
