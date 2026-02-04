import React from "react";

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import { Drawer } from "expo-router/drawer";

import { Sidebar } from "@/components/layout/Sidebar";
import PetOwnerBookingProvider from "@/hooks/pet-owner/use-pet-owner-booking";
import PetOwnerCaregiverProvider from "@/hooks/pet-owner/use-pet-owner-caregiver";
import { PetOwnerPaymentProvider } from "@/hooks/pet-owner/use-pet-owner-payment/use-pet-owner-payment";
import PetOwnerPetProvider from "@/hooks/pet-owner/use-pet-owner-pet";
import { usePetOwnerProfile } from "@/hooks/pet-owner/use-pet-owner-profile";
import LocationProvider from "@/hooks/use-location";
import NotificationProvider from "@/hooks/use-notifications";
import SocketProvider from "@/hooks/use-socket";

export default function PetOwnerDrawerLayout() {
  const { profile } = usePetOwnerProfile();
  const router = useRouter();

  const handleProfile = () => router.push("/pet-owner/account");
  const handleSettings = () => router.push("/pet-owner/settings");
  const handlePets = () => router.push("/pet-owner/pets");
  const handleMyBookings = () => router.push("/pet-owner/bookings");
  // const handleCalendar = () => router.push("/pet-owner/calendar");

  const menus = [
    {
      icon: (
        <MaterialCommunityIcons
          name="account-outline"
          size={24}
          color="black"
        />
      ),
      label: "My Account",
      onPress: handleProfile,
    },
    {
      icon: <MaterialCommunityIcons name="dog" size={24} color="black" />,
      label: "Pets",
      onPress: handlePets,
    },
    {
      icon: (
        <MaterialCommunityIcons
          name="calendar-outline"
          size={24}
          color="black"
        />
      ),
      label: "My Bookings",
      onPress: handleMyBookings,
    },
    // { label: "Calendar", onPress: handleCalendar },
    {
      icon: (
        <MaterialCommunityIcons name="cog-outline" size={24} color="black" />
      ),
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
                    drawerContent={(props) => (
                      <Sidebar
                        drawerNavigation={props.navigation}
                        profileImage={profile?.profileImage}
                        fullName={`${profile?.firstName} ${profile?.lastName}`}
                        email={profile?.email || ""}
                        menus={menus}
                      />
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
