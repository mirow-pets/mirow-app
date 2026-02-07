import { Stack } from "expo-router";

import { DefaultHeader } from "@/utils";

export default function CalendarLayout() {
  return (
    <Stack
      screenOptions={{
        header: DefaultHeader,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Calendar",
        }}
      />
    </Stack>
  );
}
