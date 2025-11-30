import { Stack } from "expo-router";

import { useAuth } from "@/hooks/use-auth";
import "react-native-reanimated";

export default function PetOwnerLayout() {
  const { currUser } = useAuth();
  return (
    <Stack>
      <Stack.Protected guard={!!currUser}>
        <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Protected guard={!currUser}>
        <Stack.Screen name="sign-up" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}
