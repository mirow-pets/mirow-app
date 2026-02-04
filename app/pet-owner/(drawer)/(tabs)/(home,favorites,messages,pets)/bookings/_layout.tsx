import { Stack } from "expo-router";

import { DefaultHeader } from "@/utils";

export default function MyBookingsLayout() {
  return (
    <Stack
      screenOptions={{
        header: DefaultHeader,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "My Bookings",
        }}
      />
      <Stack.Screen name="add" />
      <Stack.Screen
        name="[bookingId]/index"
        options={{ presentation: "modal", title: "View Booking" }}
      />
    </Stack>
  );
}
