import { Stack } from "expo-router";

import { DefaultHeader } from "@/utils";
import "react-native-reanimated";

export default function MyBanksLayout() {
  return (
    <Stack
      screenOptions={{
        header: DefaultHeader,
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
