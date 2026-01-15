import { Stack } from "expo-router";

import { defaultHeader } from "@/utils";
import "react-native-reanimated";

export default function FavoritesLayout() {
  return (
    <Stack
      screenOptions={{
        header: defaultHeader,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Favorites",
        }}
      />
      <Stack.Screen
        name="[userId]/index"
        options={{ presentation: "modal", title: "View Caregiver" }}
      />
    </Stack>
  );
}
