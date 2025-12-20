import { Text, TouchableOpacity, View } from "react-native";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Stack } from "expo-router";

import { whiteColor } from "@/constants/theme";
import "react-native-reanimated";

export default function MessagesLayout() {
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
          headerTitle: "My Earnings",
        }}
      />
      <Stack.Screen
        name="withdraw"
        options={{ presentation: "modal", title: "Withdraw" }}
      />
      <Stack.Screen
        name="withdrawals"
        options={{ presentation: "modal", title: "Withdrawals" }}
      />
    </Stack>
  );
}
