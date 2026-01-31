import React from "react";

import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import { Drawer } from "expo-router/drawer";

import { Sidebar } from "@/components/layout/Sidebar";
import CaregiverBookingProvider from "@/hooks/caregiver/use-caregiver-booking";
import CaregiverPaymentProvider from "@/hooks/caregiver/use-caregiver-payment";
import CaregiverPetProvider from "@/hooks/caregiver/use-caregiver-pet";
import { useCaregiverProfile } from "@/hooks/caregiver/use-caregiver-profile";
import LocationProvider from "@/hooks/use-location";
import NotificationProvider from "@/hooks/use-notifications";
import SocketProvider from "@/hooks/use-socket";

export default function CaregiverDrawerLayout() {
  const router = useRouter();
  const { profile } = useCaregiverProfile();

  const handleProfile = () => router.push("/caregiver/account");
  const handleMyBookings = () => router.push("/caregiver/bookings");
  const handleOpenShifts = () => router.push("/caregiver/open-shifts");
  const handleCalendar = () => router.push("/caregiver/calendar");
  const handleMyEarnings = () => router.push("/caregiver/my-earnings");
  const handleSettings = () => router.push("/caregiver/settings");

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
    {
      icon: <Feather name="clock" size={24} color="black" />,
      label: "Open Shifts",
      onPress: handleOpenShifts,
    },
    {
      icon: <FontAwesome name="calendar" size={24} color="black" />,
      label: "Calendar",
      onPress: handleCalendar,
    },
    {
      icon: (
        <MaterialCommunityIcons name="bank-check" size={24} color="black" />
      ),
      label: "My Earnings",
      onPress: handleMyEarnings,
    },
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
        <NotificationProvider>
          <CaregiverPaymentProvider>
            <CaregiverPetProvider>
              <CaregiverBookingProvider>
                <Drawer
                  screenOptions={{ headerShown: false }}
                  drawerContent={(props) => (
                    <Sidebar
                      drawerNavigation={props.navigation}
                      profileImage={profile?.users?.profileImage}
                      fullName={`${profile?.users?.firstName} ${profile?.users?.lastName}`}
                      email={profile?.users?.email || ""}
                      menus={menus}
                    />
                  )}
                  initialRouteName="(tabs)"
                >
                  <Drawer.Screen name="(tabs)" />
                </Drawer>
              </CaregiverBookingProvider>
            </CaregiverPetProvider>
          </CaregiverPaymentProvider>
        </NotificationProvider>
      </LocationProvider>
    </SocketProvider>
  );
}
