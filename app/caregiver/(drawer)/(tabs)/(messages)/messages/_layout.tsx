import { Stack } from "expo-router";

import { DefaultHeader } from "@/utils";

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
          headerTitle: "Messages",
        }}
      />
      <Stack.Screen
        name="[threadId]/index"
        options={{ presentation: "modal", title: "View Chat" }}
      />
    </Stack>
  );
}
