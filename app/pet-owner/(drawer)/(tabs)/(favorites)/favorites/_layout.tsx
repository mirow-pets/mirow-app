import { Stack } from "expo-router";

import { DefaultHeader } from "@/utils";

export default function FavoritesLayout() {
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
    </Stack>
  );
}
