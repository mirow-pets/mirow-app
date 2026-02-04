import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import * as Notifications from "expo-notifications";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";
import "react-native-reanimated";
import Toast from "react-native-toast-message";

import { ConfirmProvider } from "@/components/confirm/ConfirmProvider";
import { SplashScreen } from "@/components/SplashScreen";
import { defaultTheme } from "@/constants/theme";
import AuthProvider, { useAuth } from "@/hooks/use-auth";
import ModalProvider from "@/hooks/use-modal";
import { useNotificationObserver } from "@/hooks/use-notification-observer";
import { GoogleOAuthProvider } from "@/plugins/google/components/GoogleOauthProvider";
import { StripeProvider } from "@/plugins/stripe/components/StripeProvider";

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

export default function RootLayout() {
  useNotificationObserver();

  return (
    <GoogleOAuthProvider>
      <StripeProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <ModalProvider>
              <RootLayoutNav />
              <StatusBar style="auto" />
              <Toast />
            </ModalProvider>
          </AuthProvider>
        </QueryClientProvider>
      </StripeProvider>
    </GoogleOAuthProvider>
  );
}

const RootLayoutNav = () => {
  const { userRole, isInitializing } = useAuth();
  const [fontsLoaded] = useFonts({
    Karantina: require("@/assets/fonts/karantina/Karantina-Bold.ttf"),
    Poppins: require("@/assets/fonts/poppins/Poppins-Regular.ttf"),
    "Poppins-Bold": require("@/assets/fonts/poppins/Poppins-Bold.ttf"),
  });

  if (!fontsLoaded || isInitializing) return <SplashScreen />;

  return (
    <PaperProvider theme={defaultTheme}>
      <ConfirmProvider>
        <GestureHandlerRootView>
          <Stack initialRouteName="home" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="home" />
            <Stack.Screen name="select-role" />
            <Stack.Protected guard={!!userRole}>
              <Stack.Screen name="pet-owner" />
              <Stack.Screen name="caregiver" />
            </Stack.Protected>
          </Stack>
        </GestureHandlerRootView>
      </ConfirmProvider>
    </PaperProvider>
  );
};
