import { StyleSheet, Text, type TextProps } from "react-native";

import { useThemeColor } from "@/hooks/use-theme-color";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?:
    | "default"
    | "title"
    | "defaultSemiBold"
    | "subtitle"
    | "link"
    | "error";
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return (
    <Text
      style={[
        { color },
        type === "default" ? styles.default : undefined,
        type === "title" ? styles.title : undefined,
        type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
        type === "subtitle" ? styles.subtitle : undefined,
        type === "link" ? styles.link : undefined,
        type === "error" ? styles.error : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    fontFamily: "Poppins",
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
    fontFamily: "Poppins-Bold",
  },
  title: {
    fontSize: 72,
    fontFamily: "Karantina",
    boxShadow: `1px_3px_2px_rgba(0,0,0,0.6)`,
    textShadowColor: "rgba(0,0,0,0.4)",
    textShadowRadius: 1,
    textShadowOffset: { width: 1, height: 3 },
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: "#0a7ea4",
    fontFamily: "Poppins-Bold",
  },
  error: {
    color: "red",
    fontSize: 12,
    height: 16,
  },
});
