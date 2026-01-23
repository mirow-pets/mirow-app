import { HeaderBackButton } from "@react-navigation/elements";
import { router, Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";

import { caregiverTheme } from "@/constants/theme";
import CaregiverCaregiverProvider from "@/hooks/caregiver/use-caregiver-caregiver";
import CaregiverProfileProvider from "@/hooks/caregiver/use-caregiver-profile";
import { useAuth } from "@/hooks/use-auth";

export default function CaregiverLayout() {
  const { currUser, removeUserRole } = useAuth();

  const handleSwitchRole = async () => {
    await removeUserRole();
    router.replace("/");
  };

  return (
    <CaregiverProfileProvider>
      <CaregiverCaregiverProvider>
        <PaperProvider theme={caregiverTheme}>
          <Stack
            screenOptions={{
              headerShadowVisible: false,
            }}
          >
            <Stack.Protected guard={!!currUser}>
              <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
            </Stack.Protected>
            <Stack.Protected guard={!currUser}>
              <Stack.Screen
                name="login"
                options={{
                  headerTitle: "Log in",
                  headerShadowVisible: false,
                  headerTitleAlign: "center",
                  headerLeft: () => (
                    <HeaderBackButton onPress={handleSwitchRole} />
                  ),
                }}
              />
              <Stack.Screen name="sign-up" />
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
        </PaperProvider>
      </CaregiverCaregiverProvider>
    </CaregiverProfileProvider>
  );
}
