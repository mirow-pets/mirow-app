import { Stack } from "expo-router";

import { defaultHeader } from "@/utils";
import "react-native-reanimated";

export default function MyBanksLayout() {
  return (
    <Stack
      screenOptions={{
        header: defaultHeader,
      }}
    >
      <Stack.Screen
        name="index"
        options={{ presentation: "modal", title: "My Banks" }}
      />
      <Stack.Screen
        name="add"
        options={{ presentation: "modal", title: "Add Bank" }}
      />
    </Stack>
  );
}
