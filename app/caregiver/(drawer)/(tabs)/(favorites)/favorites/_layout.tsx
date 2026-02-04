import { Stack } from "expo-router";

import { DefaultHeader } from "@/utils";

export default function PetsLayout() {
  return (
    <Stack
      screenOptions={{
        header: DefaultHeader,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Favorites",
        }}
      />
      <Stack.Screen
        name="[petId]/index"
        options={{ presentation: "modal", title: "View Pet" }}
      />
    </Stack>
  );
}
