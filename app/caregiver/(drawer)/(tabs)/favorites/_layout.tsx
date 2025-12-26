import { Stack } from "expo-router";

import { defaultHeader } from "@/utils";
import "react-native-reanimated";

export default function PetsLayout() {
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
        name="[petId]/index"
        options={{ presentation: "modal", title: "View Pet" }}
      />
    </Stack>
  );
}
