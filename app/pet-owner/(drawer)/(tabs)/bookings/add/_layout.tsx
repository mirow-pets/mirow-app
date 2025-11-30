import { Text, TouchableOpacity, View } from "react-native";

import { MaterialIcons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import "react-native-reanimated";

export default function AddBookingLayout() {
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
          presentation: "modal",
          headerTitle: "Add Booking",
        }}
      />
      <Stack.Screen
        name="caregivers/[userId]/index"
        options={{ presentation: "modal", title: "View Caregiver" }}
      />
    </Stack>
  );
}
