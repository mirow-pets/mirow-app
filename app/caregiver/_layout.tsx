import { Stack } from "expo-router";

import CaregiverCaregiverProvider from "@/hooks/caregiver/use-caregiver-caregiver";
import { useAuth } from "@/hooks/use-auth";

export default function CaregiverLayout() {
  const { currUser } = useAuth();

  return (
    <CaregiverCaregiverProvider>
      <Stack initialRouteName="login">
        <Stack.Protected guard={!!currUser}>
          <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
        </Stack.Protected>
        <Stack.Screen name="sign-up" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
      </Stack>
    </CaregiverCaregiverProvider>
  );
}
