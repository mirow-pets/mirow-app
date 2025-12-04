import { Text, TouchableOpacity, View } from "react-native";

import { MaterialIcons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import "react-native-reanimated";

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        header: ({ options, navigation }) => (
          <View style={{ padding: 8, flexDirection: "row" }}>
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
        name="emergency-contact"
        options={{ presentation: "modal", title: "Emergency Contact" }}
      />
      <Stack.Screen
        name="preferences"
        options={{ presentation: "modal", title: "Preferences" }}
      />
      <Stack.Screen
        name="skills"
        options={{ presentation: "modal", title: "Skills" }}
      />
      <Stack.Screen
        name="experiences"
        options={{ presentation: "modal", title: "Experiences" }}
      />
      <Stack.Screen
        name="service-types"
        options={{ presentation: "modal", title: "Service Types" }}
      />
      <Stack.Screen
        name="gallery"
        options={{ presentation: "modal", title: "Gallery" }}
      />
      <Stack.Screen name="banks" />
      <Stack.Screen
        name="background-verification"
        options={{ presentation: "modal", title: "Background Verification" }}
      />
      <Stack.Screen
        name="bio-description"
        options={{ presentation: "modal", title: "Bio Description" }}
      />
    </Stack>
  );
}
