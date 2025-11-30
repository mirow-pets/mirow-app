/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { useColorScheme } from "react-native";

import { Colors, roleColors, type ColorKey } from "@/constants/theme";

import { useAuth } from "./use-auth";

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: ColorKey
) {
  const theme = useColorScheme() ?? "light";
  const colorFromProps = props[theme];
  const { userRole } = useAuth();

  if (colorFromProps) {
    return colorFromProps;
  } else {
    if (colorName === "primary" && userRole) {
      return roleColors[userRole][theme].primary;
    }
    return Colors[theme][colorName];
  }
}
