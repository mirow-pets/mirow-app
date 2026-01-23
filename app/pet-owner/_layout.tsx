import { HeaderBackButton } from "@react-navigation/elements";
import { router, Stack } from "expo-router";

import PetOwnerProfileProvider from "@/hooks/pet-owner/use-pet-owner-profile";
import { useAuth } from "@/hooks/use-auth";

export default function PetOwnerLayout() {
  const { currUser, removeUserRole } = useAuth();

  const handleSwitchRole = async () => {
    await removeUserRole();
    router.replace("/");
  };

  return (
    <PetOwnerProfileProvider>
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
              headerLeft: () => <HeaderBackButton onPress={handleSwitchRole} />,
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
    </PetOwnerProfileProvider>
  );
}
