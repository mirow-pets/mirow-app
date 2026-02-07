import { Stack } from "expo-router";

import { DefaultHeader } from "@/utils";

export default function OpenShiftsLayout() {
  return (
    <Stack
      screenOptions={{
        header: DefaultHeader,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Open Shifts",
        }}
      />
    </Stack>
  );
}
