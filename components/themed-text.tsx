import { StyleSheet, } from "react-native";

import { Text, TextProps } from "react-native-paper";


export type ThemedTextProps = TextProps<unknown> & {
  lightColor?: string;
  darkColor?: string;
  type?:
  | "default"
  | "title"
  | "defaultSemiBold"
  | "subtitle"
  | "link"
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  ...rest
}: ThemedTextProps) {

  return (
    <Text
      style={[
        type === "default" ? styles.default : undefined,
        type === "title" ? styles.title : undefined,
        type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
        type === "subtitle" ? styles.subtitle : undefined,
        type === "link" ? styles.link : undefined,
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
});
