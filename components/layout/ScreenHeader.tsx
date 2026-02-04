import { ReactNode } from "react";
import { Text, View } from "react-native";

import { HeaderBackButton } from "@react-navigation/elements";
import { router } from "expo-router";

import { whiteColor } from "@/constants/theme";
import { getStatusBarHeight } from "@/utils/get-status-bar-height";

export interface ScreenHeaderProps {
  title: string;
  left?: ReactNode;
  right?: ReactNode;
}

export const ScreenHeader = ({ left, right, title }: ScreenHeaderProps) => {
  const statusBarHeight = getStatusBarHeight();

  return (
    <View
      style={{
        flexDirection: "row",
        padding: 24,
        paddingTop: 24 + statusBarHeight,
        gap: 12,
        backgroundColor: whiteColor,
        alignItems: "center",
      }}
    >
      <View style={{ width: 48, alignItems: "flex-start" }}>
        {left ?? <HeaderBackButton onPress={router.back} />}
      </View>
      <Text
        style={{
          flex: 1,
          fontSize: 16,
          fontFamily: "Poppins-Bold",
          textAlign: "center",
        }}
      >
        {title}
      </Text>
      <View style={{ width: 48, alignItems: "flex-end" }}>{right}</View>
    </View>
  );
};
