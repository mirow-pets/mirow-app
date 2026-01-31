import { Stack } from "expo-router";

import { DefaultHeader } from "@/utils";
import "react-native-reanimated";

export default function MessagesLayout() {
  return (
    <Stack
      screenOptions={{
        header: DefaultHeader,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "My Earnings",
        }}
      />
      <Stack.Screen
        name="withdraw"
        options={{ presentation: "modal", title: "Withdraw" }}
      />
      <Stack.Screen
        name="withdrawals"
        options={{ presentation: "modal", title: "Withdrawals" }}
      />
      <Stack.Screen
        name="completed-bookings"
        options={{ presentation: "modal", title: "Completed Bookings" }}
      />
    </Stack>
  );
}
