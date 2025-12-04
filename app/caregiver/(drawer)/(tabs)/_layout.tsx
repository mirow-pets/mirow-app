import React from "react";
import { Text, TouchableOpacity, useColorScheme, View } from "react-native";

import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { DrawerActions } from "@react-navigation/native";
import { router, Tabs, useNavigation } from "expo-router";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { blackColor, Colors, primaryColor } from "@/constants/theme";
import { useAuth } from "@/hooks/use-auth";

export default function PetOwnerTabsNavigation() {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const { currUser } = useAuth();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].primary,
        // headerShown: false,
        tabBarButton: HapticTab,
        headerShadowVisible: false,
        headerStyle: {
          margin: 8,
        },
        headerTitleStyle: {
          display: "none",
        },
        header: () => (
          <View
            style={{
              marginTop: 48,
              flexDirection: "row",
              padding: 24,
              gap: 12,
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
              style={{
                paddingVertical: 2,
                paddingHorizontal: 2,
                borderWidth: 1,
                borderColor: "black",
                borderRadius: 8,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.12,
                shadowRadius: 4,
                elevation: 3,
                backgroundColor: "white",
              }}
            >
              <MaterialCommunityIcons name="account" size={32} color="black" />
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontWeight: 600,
                  fontSize: 10,
                }}
              >
                Welcome!
              </Text>
              <Text
                style={{
                  color: primaryColor,
                  fontWeight: 600,
                  textTransform: "uppercase",
                }}
              >
                {currUser?.firstName} {currUser?.lastName}
              </Text>
            </View>
            <View style={{ flexDirection: "row", gap: 4 }}>
              <TouchableOpacity
                onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
                style={{
                  paddingVertical: 4,
                  paddingHorizontal: 4,
                  borderWidth: 1,
                  borderColor: "black",
                  borderRadius: 8,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.12,
                  shadowRadius: 4,
                  elevation: 3,
                  backgroundColor: "white",
                }}
              >
                <Ionicons name="search" size={16} color="black" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push("/caregiver/notifications")}
                style={{
                  paddingVertical: 4,
                  paddingHorizontal: 4,
                  borderWidth: 1,
                  borderColor: "black",
                  borderRadius: 8,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.12,
                  shadowRadius: 4,
                  elevation: 3,
                  backgroundColor: "white",
                }}
              >
                <FontAwesome name="bell" size={16} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        ),
        tabBarShowLabel: false,
        tabBarStyle: {
          margin: 16,
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
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color }) => (
            <IconSymbol size={32} name="house.fill" color={color} />
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
        name="profile"
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
        name="notifications"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
