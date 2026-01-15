import { Stack } from "expo-router";

import CaregiverCaregiverProvider from "@/hooks/caregiver/use-caregiver-caregiver";
import { useAuth } from "@/hooks/use-auth";

export default function CaregiverLayout() {
  const { currUser } = useAuth();

  return (
    <CaregiverCaregiverProvider>
      <Stack>
        <Stack.Protected guard={!!currUser}>
          <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
        </Stack.Protected>
        <Stack.Protected guard={!currUser}>
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="sign-up" options={{ headerShown: false }} />
          <Stack.Screen
            name="forgot-password"
            options={{ title: "Forgot Password" }}
          />
          <Stack.Screen
            name="terms-and-conditions"
            options={{ title: "Terms and Conditions" }}
          />
          <Stack.Screen
            name="privacy-policy"
            options={{ title: "Privacy Policy" }}
          />
        </Stack.Protected>
      </Stack>
    </CaregiverCaregiverProvider>
  );
}
