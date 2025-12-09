import React from "react";
import { TouchableOpacity } from "react-native";

import { useRouter } from "expo-router";
import { Drawer } from "expo-router/drawer";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import PetOwnerBookingProvider from "@/hooks/pet-owner/use-pet-owner-booking";
import PetOwnerCaregiverProvider from "@/hooks/pet-owner/use-pet-owner-caregiver";
import PetOwnerPetProvider from "@/hooks/pet-owner/use-pet-owner-pet";
import { useAuth } from "@/hooks/use-auth";
import NotificationProvider from "@/hooks/use-notifications";

export default function PetOwnerDrawerLayout() {
  const router = useRouter();
  const { logout } = useAuth();

  const handleProfile = () => router.push("/pet-owner/profile");
  const handlePets = () => router.push("/pet-owner/pets");
  const handleMyBookings = () => router.push("/pet-owner/bookings");

  const handleLogout = () => {
    logout();
    router.replace("/");
  };

  const menu = [
    {
      label: "Profile",
      onPress: handleProfile,
    },
    {
      label: "Pets",
      onPress: handlePets,
    },
    { label: "My Bookings", onPress: handleMyBookings },
    { label: "Logout", onPress: handleLogout },
  ];

  return (
    <PetOwnerPetProvider>
      <NotificationProvider>
        <PetOwnerCaregiverProvider>
          <PetOwnerBookingProvider>
            <Drawer
              screenOptions={{ headerShown: false }}
              drawerContent={() => (
                <ThemedView>
                  <ThemedText
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 24,
                    }}
                  >
                    Mirow
                  </ThemedText>
                  {menu.map(({ label, onPress }, i) => (
                    <TouchableOpacity
                      key={i}
                      style={{ paddingVertical: 16, paddingHorizontal: 16 }}
                      onPress={onPress}
                    >
                      <ThemedText>{label}</ThemedText>
                    </TouchableOpacity>
                  ))}
                </ThemedView>
              )}
              initialRouteName="(tabs)"
            >
              <Drawer.Screen name="(tabs)" />
            </Drawer>
          </PetOwnerBookingProvider>
        </PetOwnerCaregiverProvider>
      </NotificationProvider>
    </PetOwnerPetProvider>
  );
}
