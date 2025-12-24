import React from "react";

import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";

import { HapticTab } from "@/components/haptic-tab";
import { TabsHeader } from "@/components/layout/TabsHeader";
import { blackColor, Colors, whiteColor } from "@/constants/theme";

export default function PetOwnerTabsNavigation() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors["light"].primary,
        // headerShown: false,
        tabBarButton: HapticTab,
        headerShadowVisible: false,
        headerStyle: {
          margin: 8,
          backgroundColor: whiteColor,
        },
        headerTitleStyle: {
          display: "none",
        },
        header: () => <TabsHeader />,
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
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="heart" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="pets"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="paw-outline" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
