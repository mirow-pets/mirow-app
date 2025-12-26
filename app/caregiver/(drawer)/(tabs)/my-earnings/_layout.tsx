import { Stack } from "expo-router";

import { defaultHeader } from "@/utils";
import "react-native-reanimated";

export default function MessagesLayout() {
  return (
    <Stack
      screenOptions={{
        header: defaultHeader,
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
    </Stack>
  );
}
