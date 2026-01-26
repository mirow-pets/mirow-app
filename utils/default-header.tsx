import { Text, View } from "react-native";

import "react-native-reanimated";

import { HeaderBackButton } from "@react-navigation/elements";

import { whiteColor } from "@/constants/theme";

import type { NativeStackHeaderProps } from "@react-navigation/native-stack";

export const defaultHeader = ({
  options,
  navigation,
}: NativeStackHeaderProps) => {
  return (
    <View
      style={{
        padding: 8,
        flexDirection: "row",
        backgroundColor: whiteColor,
        gap: 8,
        alignItems: "center",
      }}
    >
      <View style={{ width: 48, alignItems: "flex-start" }}>
        {options.presentation === "modal" && options.headerLeft ? (
          options.headerLeft({})
        ) : (
          <HeaderBackButton onPress={navigation.goBack} />
        )}
      </View>
      {typeof options.headerTitle === "function" ? (
        <View style={{ flex: 1, justifyContent: "center" }}>
          {options.headerTitle({
            children: options.title ?? "",
            tintColor: "black",
          })}
        </View>
      ) : (
        <Text
          style={{
            flex: 1,
            fontSize: 16,
            fontFamily: "Poppins-Bold",
            textAlign: "center",
          }}
        >
          {options.title ?? options.headerTitle?.toString()}
        </Text>
      )}
      <View style={{ width: 48, alignItems: "flex-end" }}>
        {options.headerRight?.({})}
      </View>
    </View>
  );
};
