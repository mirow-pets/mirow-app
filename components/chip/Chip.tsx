import React from "react";
import {
  GestureResponderEvent,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

import {
  primaryColor,
  redColor,
  secondaryColor,
  whiteColor,
} from "@/constants/theme";

import { getContrastColor } from "../../utils/color";

export interface ChipProps {
  size?: "sm" | "md" | "lg";
  color?: "primary" | "secondary" | "white" | "error";
  corner?: "square" | "rounded" | "pill";
  mode?: "flat" | "outlined";
  onPress?: (_event: GestureResponderEvent) => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  children: React.ReactNode;
  disabled?: boolean;
}

export const Chip = ({
  color = "primary",
  size = "md",
  corner = "pill",
  mode = "flat",
  onPress,
  style,
  textStyle,
  children,
  disabled = false,
}: ChipProps) => {
  const chipSizeStyles = chipSizes[size];

  // Get background color
  const backgroundColor =
    mode === "outlined"
      ? "transparent"
      : color === "primary"
      ? primaryColor
      : color === "secondary"
      ? secondaryColor
      : color === "white"
      ? whiteColor
      : redColor;

  // Get border color
  const borderColor =
    mode === "outlined"
      ? color === "primary"
        ? primaryColor
        : color === "secondary"
        ? secondaryColor
        : color === "white"
        ? whiteColor
        : redColor
      : backgroundColor;

  // Get text color
  const textColor =
    mode === "outlined" ? borderColor : getContrastColor(backgroundColor);

  // Compute the borderRadius
  let borderRadius: number;
  if (corner === "pill") {
    const height =
      chipSizeStyles.fontSize +
      chipSizeStyles.paddingVertical * 2 +
      (size === "sm" ? 4 : size === "md" ? 6 : 8);
    borderRadius = height;
  } else if (corner === "rounded") {
    borderRadius = 8;
  } else {
    borderRadius = 0;
  }

  const chipStyle: ViewStyle = {
    backgroundColor: mode === "outlined" ? "transparent" : backgroundColor,
    borderWidth: mode === "outlined" ? 1 : 0,
    borderColor: borderColor,
    borderRadius,
    paddingVertical: chipSizeStyles.paddingVertical,
    paddingHorizontal: chipSizeStyles.paddingHorizontal,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
    opacity: disabled ? 0.5 : 1,
  };

  // Check if children is a string (simple text) or a React element (like ThemedText)
  const isString = typeof children === "string";

  const content = (
    <View style={[chipStyle, style]}>
      {isString ? (
        <Text
          style={[
            {
              color: textColor,
              fontSize: chipSizeStyles.fontSize,
              fontWeight: "500",
            },
            textStyle,
          ]}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </View>
  );

  if (onPress && !disabled) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

export const chipSizes = {
  sm: {
    paddingVertical: 2,
    paddingHorizontal: 12,
    fontSize: 9,
  },
  md: {
    paddingVertical: 4,
    paddingHorizontal: 14,
    fontSize: 12,
  },
  lg: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    fontSize: 16,
  },
};
