import { Stack } from "expo-router";

import { defaultHeader } from "@/utils";
import "react-native-reanimated";

export default function MyBookingsLayout() {
  return (
    <Stack
      screenOptions={{
        header: defaultHeader,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "My Bookings",
        }}
      />
      <Stack.Screen
        name="add"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="[bookingId]/index"
        options={{ presentation: "modal", title: "View Booking" }}
      />
    </Stack>
  );
}
