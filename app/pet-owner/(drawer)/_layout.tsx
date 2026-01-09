import React from "react";
import { TouchableOpacity, View } from "react-native";

import { useRouter } from "expo-router";
import { Drawer } from "expo-router/drawer";

import { ThemedText } from "@/components/themed-text";
import { whiteColor } from "@/constants/theme";
import PetOwnerBookingProvider from "@/hooks/pet-owner/use-pet-owner-booking";
import PetOwnerCaregiverProvider from "@/hooks/pet-owner/use-pet-owner-caregiver";
import PetOwnerPaymentProvider from "@/hooks/pet-owner/use-pet-owner-payment";
import PetOwnerPetProvider from "@/hooks/pet-owner/use-pet-owner-pet";
import LocationProvider from "@/hooks/use-location";
import NotificationProvider from "@/hooks/use-notifications";
import SocketProvider from "@/hooks/use-socket";

export default function PetOwnerDrawerLayout() {
  const router = useRouter();

  const handleProfile = () => router.push("/pet-owner/profile");
  const handleSettings = () => router.push("/pet-owner/settings");
  const handlePets = () => router.push("/pet-owner/pets");
  const handleMyBookings = () => router.push("/pet-owner/bookings");
  const handleCalendar = () => router.push("/pet-owner/calendar");

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
    { label: "Calendar", onPress: handleCalendar },
    {
      label: "Settings",
      onPress: handleSettings,
    },
  ];

  return (
    <SocketProvider>
      <LocationProvider>
        <PetOwnerPetProvider>
          <NotificationProvider>
            <PetOwnerPaymentProvider>
              <PetOwnerCaregiverProvider>
                <PetOwnerBookingProvider>
                  <Drawer
                    screenOptions={{ headerShown: false }}
                    drawerContent={() => (
                      <View style={{ backgroundColor: whiteColor }}>
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
                            style={{
                              paddingVertical: 16,
                              paddingHorizontal: 16,
                            }}
                            onPress={onPress}
                          >
                            <ThemedText>{label}</ThemedText>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                    initialRouteName="(tabs)"
                  >
                    <Drawer.Screen name="(tabs)" />
                  </Drawer>
                </PetOwnerBookingProvider>
              </PetOwnerCaregiverProvider>
            </PetOwnerPaymentProvider>
          </NotificationProvider>
        </PetOwnerPetProvider>
      </LocationProvider>
    </SocketProvider>
  );
}
