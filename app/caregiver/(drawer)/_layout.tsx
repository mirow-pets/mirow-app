import React, { useCallback, useMemo } from "react";

import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { DrawerContentComponentProps } from "@react-navigation/drawer";
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

const drawerScreenOptions = { headerShown: false };

export default function CaregiverDrawerLayout() {
  const router = useRouter();
  const { profile } = useCaregiverProfile();

  const handleProfile = useCallback(
    () => router.push("/caregiver/account"),
    [router]
  );
  const handleMyBookings = useCallback(
    () => router.push("/caregiver/bookings"),
    [router]
  );
  const handleOpenShifts = useCallback(
    () => router.push("/caregiver/open-shifts"),
    [router]
  );
  const handleCalendar = useCallback(
    () => router.push("/caregiver/calendar"),
    [router]
  );
  const handleMyEarnings = useCallback(
    () => router.push("/caregiver/my-earnings"),
    [router]
  );
  const handleSettings = useCallback(
    () => router.push("/caregiver/settings"),
    [router]
  );

  const menus = useMemo(
    () => [
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
    ],
    [
      handleProfile,
      handleMyBookings,
      handleOpenShifts,
      handleCalendar,
      handleMyEarnings,
      handleSettings,
    ]
  );

  const drawerContent = useCallback(
    (props: DrawerContentComponentProps) => (
      <Sidebar
        drawerNavigation={props.navigation}
        profileImage={profile?.users?.profileImage}
        fullName={
          `${profile?.users?.firstName ?? ""} ${
            profile?.users?.lastName ?? ""
          }`.trim() || "Profile"
        }
        email={profile?.users?.email ?? ""}
        menus={menus}
      />
    ),
    [
      profile?.users?.profileImage,
      profile?.users?.firstName,
      profile?.users?.lastName,
      profile?.users?.email,
      menus,
    ]
  );

  return (
    <SocketProvider>
      <LocationProvider>
        <NotificationProvider>
          <CaregiverPaymentProvider>
            <CaregiverPetProvider>
              <CaregiverBookingProvider>
                <Drawer
                  screenOptions={drawerScreenOptions}
                  drawerContent={drawerContent}
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
