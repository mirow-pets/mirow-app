import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { primaryColor } from "@/constants/theme";

interface LoaderProps {
  size?: "small" | "large";
  color?: string;
}

export const Loader = ({
  size = "large",
  color = primaryColor,
}: LoaderProps) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
