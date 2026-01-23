import { Stack } from "expo-router";

import PetOwnerCaregiverFilterProvider from "@/hooks/pet-owner/use-pet-owner-caregivers-filter";
import "react-native-reanimated";

export default function AddBookingLayout() {
  return (
    <PetOwnerCaregiverFilterProvider>
      <Stack
        screenOptions={{
          // header: defaultHeader,
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            presentation: "modal",
            headerTitle: "Add Booking",
          }}
        />
        <Stack.Screen
          name="caregivers/[userId]/index"
          options={{ presentation: "modal", title: "View Caregiver" }}
        />
        <Stack.Screen
          name="caregivers/filter"
          options={{ presentation: "modal", title: "Caregivers Filter" }}
        />
      </Stack>
    </PetOwnerCaregiverFilterProvider>
  );
}
