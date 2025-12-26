import { Text, TouchableOpacity, View } from "react-native";

import { MaterialIcons } from "@expo/vector-icons";
import "react-native-reanimated";

import type { NativeStackHeaderProps } from "@react-navigation/native-stack";

export const defaultHeader = ({
  options,
  navigation,
}: NativeStackHeaderProps) => (
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
);
