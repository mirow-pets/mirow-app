import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { FontAwesome } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";

import { Colors, primaryColor, tertiary, whiteColor } from "@/constants/theme";

export const HomeTabsHeader = () => {
  const colorScheme = "light";
  const handleSelectRole = () => router.push(`/select-role`);

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
        onPress={handleSelectRole}
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
      <View style={{ flex: 1, flexDirection: "row", gap: 4 }}>
        <Text
          style={{
            fontWeight: 600,
            fontSize: 16,
          }}
        >
          Welcome!
        </Text>
        <Text
          style={{
            fontWeight: 600,
            fontSize: 16,
            color: primaryColor,
          }}
          onPress={handleSelectRole}
        >
          Log in
        </Text>
      </View>
      <View style={{ flexDirection: "row", gap: 4 }}>
        <TouchableOpacity
          onPress={handleSelectRole}
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
          onPress={handleSelectRole}
          style={[
            styles.button,
            { backgroundColor: Colors[colorScheme].background },
          ]}
        >
          <FontAwesome name="bell" size={16} color={Colors[colorScheme].text} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 4,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  badge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: tertiary,
    borderRadius: 20,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
});
