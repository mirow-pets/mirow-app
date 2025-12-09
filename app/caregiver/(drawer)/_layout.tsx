import React from "react";
import { TouchableOpacity } from "react-native";

import { useRouter } from "expo-router";
import { Drawer } from "expo-router/drawer";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import CaregiverBookingProvider from "@/hooks/caregiver/use-caregiver-booking";
import CaregiverProfileProvider from "@/hooks/caregiver/use-caregiver-profile";
import { useAuth } from "@/hooks/use-auth";
import NotificationProvider from "@/hooks/use-notifications";

export default function CaregeiverDrawerLayout() {
  const router = useRouter();
  const { logout } = useAuth();

  const handleProfile = () => router.push("/caregiver/profile");
  const handleMyBookings = () => {
    router.push("/caregiver/bookings");
  };

  const handleLogout = () => {
    logout();
    router.replace("/");
  };

  const menu = [
    {
      label: "Profile",
      onPress: handleProfile,
    },
    { label: "My Bookings", onPress: handleMyBookings },
    { label: "Logout", onPress: handleLogout },
  ];

  return (
    <CaregiverProfileProvider>
      <NotificationProvider>
        <CaregiverBookingProvider>
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
        </CaregiverBookingProvider>
      </NotificationProvider>
    </CaregiverProfileProvider>
  );
}
