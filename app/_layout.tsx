import { useColorScheme } from "react-native";

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import Toast from "react-native-toast-message";

import AuthProvider, { useAuth } from "@/hooks/use-auth";
import BookingProvider from "@/hooks/use-booking";
import CaregiverProvider from "@/hooks/use-caregiver";
import ModalProvider from "@/hooks/use-modal";
import PetProvider from "@/hooks/use-pet";
import { UserRole } from "@/types/users";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <ModalProvider>
        <AuthProvider>
          <PetProvider>
            <CaregiverProvider>
              <BookingProvider>
                <RootLayoutNav />
                <StatusBar style="auto" />
              </BookingProvider>
            </CaregiverProvider>
          </PetProvider>
        </AuthProvider>
      </ModalProvider>
    </QueryClientProvider>
  );
}

const RootLayoutNav = () => {
  const colorScheme = useColorScheme();
  const { userRole } = useAuth();
  const [fontsLoaded] = useFonts({
    Karantina: require("@/assets/fonts/karantina/Karantina-Bold.ttf"),
    Poppins: require("@/assets/fonts/poppins/Poppins-Regular.ttf"),
    "Poppins-Bold": require("@/assets/fonts/poppins/Poppins-Bold.ttf"),
  });

  if (!fontsLoaded) return null;

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <GestureHandlerRootView>
        <Stack initialRouteName="select-role">
          <Stack.Screen name="select-role" options={{ headerShown: false }} />
          <Stack.Protected guard={!!userRole}>
            {userRole === UserRole.PetOwner ? (
              <Stack.Screen
                name={"pet-owner"}
                options={{ headerShown: false }}
              />
            ) : (
              <Stack.Screen name="caregiver" options={{ headerShown: false }} />
            )}
          </Stack.Protected>
        </Stack>
        <Toast />
      </GestureHandlerRootView>
    </ThemeProvider>
  );
};
