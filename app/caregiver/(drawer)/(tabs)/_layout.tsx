import React, { useMemo } from "react";

import { AntDesign } from "@expo/vector-icons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Tabs } from "expo-router";

import { HapticTab } from "@/components/haptic-tab";
import { blackColor, whiteColor } from "@/constants/theme";
import { useThemeColor } from "@/hooks/use-theme-color";

export const unstable_settings = {
  initialRouteName: "(home)",
};

const tabBarStyle = {
  paddingTop: 2,
  borderRadius: 12,
  width: "100%" as const,
  maxWidth: 280,
  height: 48,
  alignSelf: "center" as const,
  borderColor: blackColor,
  borderWidth: 1,
  alignItems: "center" as const,
  paddingVertical: 16,
  paddingHorizontal: 24,
  backgroundColor: whiteColor,
  position: "absolute" as const,
  marginLeft: "50%" as const,
  transform: [{ translateX: "-50%" }] as const,
  left: 0,
  bottom: 32,
};

export default function CaregiverTabsNavigation() {
  const primaryColor = useThemeColor({}, "primary");
  const screenOptions = useMemo(
    () => ({
      tabBarActiveTintColor: primaryColor,
      tabBarButton: HapticTab,
      headerTitleStyle: { display: "none" as const },
      tabBarShowLabel: false,
      tabBarStyle,
    }),
    [primaryColor]
  );
  return (
    <Tabs initialRouteName="(home)" screenOptions={screenOptions}>
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
