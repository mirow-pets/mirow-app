import React from "react";
import { TouchableOpacity, View } from "react-native";

import { useRouter } from "expo-router";
import { Drawer } from "expo-router/drawer";

import { ThemedText } from "@/components/themed-text";
import CaregiverBookingProvider from "@/hooks/caregiver/use-caregiver-booking";
import CaregiverPaymentProvider from "@/hooks/caregiver/use-caregiver-payment";
import CaregiverPetProvider from "@/hooks/caregiver/use-caregiver-pet";
import CaregiverProfileProvider from "@/hooks/caregiver/use-caregiver-profile";
import LocationProvider from "@/hooks/use-location";
import NotificationProvider from "@/hooks/use-notifications";
import SocketProvider from "@/hooks/use-socket";

export default function CaregeiverDrawerLayout() {
  const router = useRouter();

  const handleProfile = () => router.push("/caregiver/profile");
  const handleMyBookings = () => router.push("/caregiver/bookings");
  const handleOpenShifts = () => router.push("/caregiver/open-shifts");
  const handleCalendar = () => router.push("/caregiver/calendar");
  const handleMyEarnings = () => router.push("/caregiver/my-earnings");
  const handleSettings = () => router.push("/caregiver/settings");

  const menu = [
    {
      label: "Profile",
      onPress: handleProfile,
    },
    { label: "My Bookings", onPress: handleMyBookings },
    { label: "Open Shifts", onPress: handleOpenShifts },
    { label: "Calendar", onPress: handleCalendar },
    { label: "My Earnings", onPress: handleMyEarnings },
    { label: "Settings", onPress: handleSettings },
  ];

  return (
    <SocketProvider>
      <LocationProvider>
        <CaregiverProfileProvider>
          <NotificationProvider>
            <CaregiverPaymentProvider>
              <CaregiverPetProvider>
                <CaregiverBookingProvider>
                  <Drawer
                    screenOptions={{ headerShown: false }}
                    drawerContent={() => (
                      <View>
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
                </CaregiverBookingProvider>
              </CaregiverPetProvider>
            </CaregiverPaymentProvider>
          </NotificationProvider>
        </CaregiverProfileProvider>
      </LocationProvider>
    </SocketProvider>
  );
}
