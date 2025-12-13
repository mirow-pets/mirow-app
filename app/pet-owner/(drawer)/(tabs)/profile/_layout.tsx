import { Text, TouchableOpacity, View } from "react-native";

import { MaterialIcons } from "@expo/vector-icons";
import { Stack } from "expo-router";

import { whiteColor } from "@/constants/theme";
import "react-native-reanimated";

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        header: ({ options, navigation }) => (
          <View
            style={{
              padding: 8,
              flexDirection: "row",
              backgroundColor: whiteColor,
            }}
          >
            {options.presentation === "modal" && (
              <TouchableOpacity onPress={navigation.goBack}>
                <MaterialIcons name="arrow-back" size={24} color="black" />
              </TouchableOpacity>
            )}
            <Text
              style={{
                textAlign: "center",
                fontSize: 16,
                fontFamily: "Poppins-Bold",
              }}
            >
              {options.title ?? options.headerTitle?.toString()}
            </Text>
          </View>
        ),
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "My Profile",
        }}
      />
      <Stack.Screen
        name="fullname"
        options={{ presentation: "modal", title: "Fullname" }}
      />
      <Stack.Screen
        name="phone"
        options={{ presentation: "modal", title: "Phone" }}
      />
      <Stack.Screen
        name="emergency-contact"
        options={{ presentation: "modal", title: "Emergency Contact" }}
      />
      <Stack.Screen
        name="banks"
        options={{ presentation: "modal", title: "Payment Methods" }}
      />
      <Stack.Screen
        name="address"
        options={{ presentation: "modal", title: "Address" }}
      />
    </Stack>
  );
}
