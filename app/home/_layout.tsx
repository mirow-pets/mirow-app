import React from "react";

import { AntDesign, Ionicons } from "@expo/vector-icons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Tabs } from "expo-router";

import { HapticTab } from "@/components/haptic-tab";
import { HomeTabsHeader } from "@/components/layout/HomeTabsHeader";
import { blackColor, Colors, whiteColor } from "@/constants/theme";
import LocationProvider from "@/hooks/use-location";

export default function HomeTabsNavigation() {
  return (
    <LocationProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors["light"].primary,
          // headerShown: false,
          tabBarButton: HapticTab,
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: whiteColor,
          },
          headerTitleStyle: {
            display: "none",
          },
          header: () => <HomeTabsHeader />,
          tabBarShowLabel: false,
          tabBarStyle: {
            paddingTop: 2,
            borderRadius: 12,
            width: "100%",
            maxWidth: 280,
            height: 48,
            alignSelf: "center",
            borderColor: blackColor,
            borderWidth: 1,
            alignItems: "center",
            paddingVertical: 16,
            paddingHorizontal: 24,
            backgroundColor: whiteColor,
            position: "absolute",
            marginLeft: "50%",
            transform: [{ translateX: "-50%" }],
            left: 0,
            bottom: 32,
          },
        }}
        initialRouteName="index"
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ color }) => (
              <FontAwesome6 size={28} name="house" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="messages"
          options={{
            tabBarIcon: ({ color }) => (
              <AntDesign name="message" size={28} color={color} />
            ),
            tabBarStyle: { opacity: 0.5 },
          }}
          listeners={{
            tabPress: (e) => e.preventDefault(),
          }}
        />
        <Tabs.Screen
          name="favorites"
          options={{
            tabBarIcon: ({ color }) => (
              <FontAwesome6 name="heart" size={28} color={color} />
            ),
            tabBarStyle: { opacity: 0.5 },
          }}
          listeners={{
            tabPress: (e) => e.preventDefault(),
          }}
        />
        <Tabs.Screen
          name="pets"
          options={{
            tabBarIcon: ({ color }) => (
              <Ionicons name="paw-outline" size={28} color={color} />
            ),
            tabBarStyle: { opacity: 0.5 },
          }}
          listeners={{
            tabPress: (e) => e.preventDefault(),
          }}
        />
      </Tabs>
    </LocationProvider>
  );
}
