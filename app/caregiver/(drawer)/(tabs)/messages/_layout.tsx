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
