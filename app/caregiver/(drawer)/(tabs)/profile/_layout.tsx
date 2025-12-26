import { Stack } from "expo-router";

import { defaultHeader } from "@/utils";
import "react-native-reanimated";

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        header: defaultHeader,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "My Profile",
        }}
      />
      <Stack.Screen
        name="fullname"
        options={{ presentation: "modal", title: "Fullname" }}
      />
      <Stack.Screen
        name="phone"
        options={{ presentation: "modal", title: "Phone" }}
      />
      <Stack.Screen
        name="emergency-contact"
        options={{ presentation: "modal", title: "Emergency Contact" }}
      />
      <Stack.Screen
        name="preferences"
        options={{ presentation: "modal", title: "Preferences" }}
      />
      <Stack.Screen
        name="skills"
        options={{ presentation: "modal", title: "Skills" }}
      />
      <Stack.Screen
        name="experiences"
        options={{ presentation: "modal", title: "Experiences" }}
      />
      <Stack.Screen
        name="service-types"
        options={{ presentation: "modal", title: "Rates and Services" }}
      />
      <Stack.Screen
        name="gallery"
        options={{ presentation: "modal", title: "Gallery" }}
      />
      <Stack.Screen name="banks" />
      <Stack.Screen
        name="background-verification"
        options={{ presentation: "modal", title: "Background Verification" }}
      />
      <Stack.Screen
        name="bio-description"
        options={{ presentation: "modal", title: "Bio Description" }}
      />
      <Stack.Screen
        name="address"
        options={{ presentation: "modal", title: "Address" }}
      />
    </Stack>
  );
}
