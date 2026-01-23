import React from "react";

import {
  Button as BaseButton,
  ButtonProps as BaseButtonProps,
  useTheme,
} from "react-native-paper";

import { whiteColor } from "@/constants/theme";

import { getContrastColor } from "../../utils/color";

export interface ButtonProps extends BaseButtonProps {
  size?: "sm" | "md" | "lg";
  color?: "primary" | "secondary" | "white" | "error";
  corner?: "square" | "rounded" | "pill";
}

export const Button = ({
  color = "primary",
  size = "md",
  corner = "pill",
  style,
  accessibilityLabel,
  children,
  ...props
}: ButtonProps) => {
  const theme = useTheme();
  const colors = {
    ...theme.colors,
    white: whiteColor,
  };

  const buttonSizeStyles = buttonSizes[size];
  const contrastColor = getContrastColor(colors[color]);

  // Compute the borderRadius for "pill" as half of the estimated button height
  let borderRadius;
  if (corner === "pill") {
    // Estimated height: fontSize + paddingVertical * 2 + extra fudge if needed
    const height =
      buttonSizeStyles.fontSize + buttonSizeStyles.paddingVertical * 2 + 4; // fudge factor to ensure rounding for larger text
    borderRadius = height;
  } else if (corner === "rounded") {
    borderRadius = 8;
  } else {
    borderRadius = 0;
  }

  return (
    <BaseButton
      {...props}
      buttonColor={colors[color]}
      textColor={contrastColor}
      style={[
        {
          borderRadius,
        },
        style,
      ]}
      labelStyle={{
        fontSize: buttonSizeStyles.fontSize,
        paddingVertical: buttonSizeStyles.paddingVertical,
        paddingHorizontal: buttonSizeStyles.paddingHorizontal,
      }}
    >
      {children}
    </BaseButton>
  );
};

export const buttonSizes = {
  sm: {
    paddingVertical: 2,
    paddingHorizontal: 3,
    fontSize: 10,
  },
  md: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    fontSize: 16,
  },
  lg: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    fontSize: 20,
  },
};

// No longer needed, but kept for reference, not used in Button anymore
export const cornerRadii = {
  square: 0,
  rounded: 8,
  pill: undefined,
};
