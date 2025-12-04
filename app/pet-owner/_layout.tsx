import { Stack } from "expo-router";

import { useAuth } from "@/hooks/use-auth";
import BookingProvider from "@/hooks/use-booking";
import CaregiverProvider from "@/hooks/use-caregiver";
import NotificationProvider from "@/hooks/use-notifications";
import PetProvider from "@/hooks/use-pet";
import "react-native-reanimated";

export default function PetOwnerLayout() {
  const { currUser } = useAuth();
  return (
    <PetProvider>
      <CaregiverProvider>
        <BookingProvider>
          <NotificationProvider>
            <Stack>
              <Stack.Protected guard={!!currUser}>
                <Stack.Screen
                  name="(drawer)"
                  options={{ headerShown: false }}
                />
              </Stack.Protected>
              <Stack.Protected guard={!currUser}>
                <Stack.Screen name="sign-up" options={{ headerShown: false }} />
                <Stack.Screen name="login" options={{ headerShown: false }} />
              </Stack.Protected>
            </Stack>
          </NotificationProvider>
        </BookingProvider>
      </CaregiverProvider>
    </PetProvider>
  );
}
