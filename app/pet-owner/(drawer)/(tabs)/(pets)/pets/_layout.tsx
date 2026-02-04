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
          headerTitle: "Pets",
        }}
      />
      <Stack.Screen
        name="add"
        options={{ presentation: "modal", title: "Add Pet" }}
      />
      <Stack.Screen
        name="[petId]/index"
        options={{ presentation: "modal", title: "View Pet" }}
      />
      <Stack.Screen
        name="[petId]/edit"
        options={{ presentation: "modal", title: "Edit Pet" }}
      />
    </Stack>
  );
}
