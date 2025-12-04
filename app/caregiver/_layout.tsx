import { Stack } from "expo-router";

import { useAuth } from "@/hooks/use-auth";
import BookingProvider from "@/hooks/use-booking";
import CaregiverProvider from "@/hooks/use-caregiver";
import NotificationProvider from "@/hooks/use-notifications";
import PaymentProvider from "@/hooks/use-payment";
import "react-native-reanimated";

export default function CaregiverLayout() {
  const { currUser } = useAuth();
  return (
    <CaregiverProvider>
      <BookingProvider>
        <NotificationProvider>
          <PaymentProvider>
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
          </PaymentProvider>
        </NotificationProvider>
      </BookingProvider>
    </CaregiverProvider>
  );
}
