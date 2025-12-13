import { Stack } from "expo-router";

import PetOwnerProfileProvider from "@/hooks/pet-owner/use-pet-owner-profile";
import { useAuth } from "@/hooks/use-auth";

export default function PetOwnerLayout() {
  const { currUser } = useAuth();

  return (
    <PetOwnerProfileProvider>
      <Stack initialRouteName="login">
        <Stack.Protected guard={!!currUser}>
          <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
        </Stack.Protected>
        <Stack.Screen name="sign-up" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
      </Stack>
    </PetOwnerProfileProvider>
  );
}
