import { StripeProvider } from "@stripe/stripe-react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import * as Notifications from "expo-notifications";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";
import "react-native-reanimated";
import Toast from "react-native-toast-message";

import { defaultTheme } from "@/constants/theme";
import { ENV } from "@/env";
import AuthProvider, { useAuth } from "@/hooks/use-auth";
import ModalProvider from "@/hooks/use-modal";
import { useNotificationObserver } from "@/hooks/use-notification-observer";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      refetchOnMount: true,
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,
      retry: 2,
      gcTime: 0,
    },
  },
});

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

SplashScreen.preventAutoHideAsync();

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
    <PaperProvider theme={defaultTheme}>
      <GestureHandlerRootView>
        <Stack initialRouteName="index">
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="home" options={{ headerShown: false }} />
          <Stack.Screen name="select-role" options={{ headerShown: false }} />
          <Stack.Protected guard={!!userRole}>
            <Stack.Screen name="pet-owner" options={{ headerShown: false }} />
            <Stack.Screen name="caregiver" options={{ headerShown: false }} />
          </Stack.Protected>
        </Stack>
      </GestureHandlerRootView>
    </PaperProvider>
  );
};
