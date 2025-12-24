import React, { ReactNode } from "react";
import {
  ActivityIndicator,
  ButtonProps as BaseButtonProps,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

import { whiteColor } from "@/constants/theme";
import { useThemeColor } from "@/hooks/use-theme-color";

export interface ButtonProps extends BaseButtonProps {
  variant?: "contained" | "reversed" | "outlined" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: ReactNode;
  style?: StyleProp<ViewStyle>;
  color?: "primary" | "secondary";
}

export const Button = ({
  title,
  onPress,
  variant = "contained",
  color = "primary",
  size = "md",
  loading = false,
  disabled = false,
  icon = null,
  style,
  accessibilityLabel,
  ...rest
}: ButtonProps) => {
  const buttonColor = useThemeColor({}, color);
  const isDisabled = disabled || loading;

  const containerStyle = [
    styles.base,
    size === "sm" && styles.sm,
    size === "lg" && styles.lg,
    variant === "contained" && {
      backgroundColor: buttonColor,
    },
    variant === "reversed" && {
      backgroundColor: whiteColor,
    },
    style,
  ];

  const textStyle = [
    styles.text,
    size === "sm" && styles.textSm,
    size === "lg" && styles.textLg,
    variant === "contained" && {
      color: whiteColor,
    },
    variant === "reversed" && {
      color: buttonColor,
    },
  ];

  return (
    <TouchableOpacity
      accessibilityLabel={accessibilityLabel || title}
      accessibilityRole="button"
      onPress={onPress}
      disabled={isDisabled}
      style={[containerStyle, isDisabled ? styles.disabled : {}]}
      {...rest}
    >
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size={24} />
        ) : (
          <>
            {icon ? <View style={styles.iconWrapper}>{icon}</View> : null}
            <Text numberOfLines={1} ellipsizeMode="tail" style={textStyle}>
              {title}
            </Text>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    minWidth: 140,
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 56,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
    fontFamily: "Poppins-Bold",
    fontWeight: 600,
    lineHeight: 32,
    textAlign: "center",
  },
  sm: {
    minWidth: 110,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  lg: {
    minWidth: 180,
    paddingVertical: 16,
    paddingHorizontal: 18,
  },
  text: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
  },
  textSm: { fontSize: 14 },
  textLg: { fontSize: 18 },
  content: { flexDirection: "row", alignItems: "center", gap: 8 },
  iconWrapper: {
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: { opacity: 0.85 },
});
