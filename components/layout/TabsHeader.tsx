import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { DrawerActions } from "@react-navigation/native";
import { useNavigation } from "expo-router";

import { whiteColor } from "@/constants/theme";
import { useAuth } from "@/hooks/use-auth";
import { useThemeColor } from "@/hooks/use-theme-color";
import { UserRole } from "@/types";

import { NotificationButton } from "./NotificationButton";

export const TabsHeader = () => {
  const primaryColor = useThemeColor({}, "primary");
  const navigation = useNavigation();
  const { currUser, userRole } = useAuth();

  return (
    <View
      style={{
        marginTop: 48,
        flexDirection: "row",
        padding: 24,
        gap: 12,
        alignItems: "center",
        backgroundColor: whiteColor,
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
        <NotificationButton userRole={userRole as UserRole} />
      </View>
    </View>
  );
};
