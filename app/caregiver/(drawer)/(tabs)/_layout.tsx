import React from "react";

import { AntDesign } from "@expo/vector-icons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Tabs } from "expo-router";

import { HapticTab } from "@/components/haptic-tab";
import { blackColor, whiteColor } from "@/constants/theme";
import { useThemeColor } from "@/hooks/use-theme-color";

export const unstable_settings = {
  initialRouteName: "index",
};

export default function CaregiverTabsNavigation() {
  const primaryColor = useThemeColor({}, "primary");
  return (
    <Tabs
      initialRouteName="(main)"
      screenOptions={{
        tabBarActiveTintColor: primaryColor,
        tabBarButton: HapticTab,
        headerTitleStyle: {
          display: "none",
        },
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
        name="(home)"
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome6 size={28} name="house" color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="(main)"
        options={{
          href: null,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="(messages)"
        options={{
          tabBarIcon: ({ color }) => (
            <AntDesign name="message" size={28} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="(favorites)"
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="heart" size={28} color={color} />
          ),
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
