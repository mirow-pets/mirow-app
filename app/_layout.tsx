import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { StripeProvider } from "@stripe/stripe-react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import * as Notifications from "expo-notifications";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import Toast from "react-native-toast-message";

import { ENV } from "@/env";
import AuthProvider, { useAuth } from "@/hooks/use-auth";
import ModalProvider from "@/hooks/use-modal";
import { useNotificationObserver } from "@/hooks/use-notification-observer";
import { UserRole } from "@/types";

const queryClient = new QueryClient();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function RootLayout() {
  useNotificationObserver();

  return (
    <StripeProvider
      publishableKey={ENV.STRIPE_PUBLISHABLE_KEY}
      merchantIdentifier={ENV.MERCHANT_NAME}
      urlScheme={ENV.URL_SCHEME}
    >
      <QueryClientProvider client={queryClient}>
        <ModalProvider>
          <AuthProvider>
            <RootLayoutNav />
            <StatusBar style="auto" />
            <Toast />
          </AuthProvider>
        </ModalProvider>
      </QueryClientProvider>
    </StripeProvider>
  );
}

const RootLayoutNav = () => {
  const { userRole } = useAuth();
  const [fontsLoaded] = useFonts({
    Karantina: require("@/assets/fonts/karantina/Karantina-Bold.ttf"),
    Poppins: require("@/assets/fonts/poppins/Poppins-Regular.ttf"),
    "Poppins-Bold": require("@/assets/fonts/poppins/Poppins-Bold.ttf"),
  });

  if (!fontsLoaded) return null;

  return (
    <ThemeProvider value={DefaultTheme}>
      <GestureHandlerRootView>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Protected guard={!!userRole}>
            {userRole === UserRole.PetOwner ? (
              <Stack.Screen name="pet-owner" options={{ headerShown: false }} />
            ) : (
              <Stack.Screen name="caregiver" options={{ headerShown: false }} />
            )}
          </Stack.Protected>
        </Stack>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
};
