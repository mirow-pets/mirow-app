import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { router } from "expo-router";
import { useTheme } from "react-native-paper";

import { useAuth } from "@/hooks/use-auth";
import { UserRole } from "@/types";

export interface CompleteAccountSetupProps {
  /** 0–1 (e.g. 0.67) or 0–100 (e.g. 67) */
  progress: number;
}

const SIZE = 56;
const STROKE = 5;

export const CompleteAccountSetup = ({
  progress,
}: CompleteAccountSetupProps) => {
  const theme = useTheme();
  const { userRole } = useAuth();

  const percent =
    progress <= 1
      ? Math.min(1, Math.max(0, progress)) * 100
      : Math.min(100, Math.max(0, progress));

  const handlePress = () => {
    router.push(`/${userRole as UserRole}/account`);
  };

  return (
    <TouchableOpacity
      style={[styles.banner, { borderColor: theme.colors.primary }]}
      onPress={handlePress}
    >
      <View style={styles.donutContainer}>
        <View style={styles.donutInner}>
          {/* Center label */}
          <View style={styles.percentOverlay}>
            <Text style={[styles.percent, { color: theme.colors.primary }]}>
              {Math.round(percent)}%
            </Text>
          </View>
        </View>
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text
          style={[
            styles.text,
            {
              color: theme.colors.primary,
              flexShrink: 1,
              flexWrap: "wrap",
              minWidth: 0,
              maxWidth: "100%",
            },
          ]}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          Please complete your account setup to continue.
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  banner: {
    borderRadius: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: "#FFB300",
    flexDirection: "row",
    gap: 16,
  },
  text: {
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 8,
  },
  donutContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
    width: 60,
    height: 60,
  },
  donutInner: {
    width: SIZE,
    height: SIZE,
    justifyContent: "center",
    alignItems: "center",
  },
  ring: {
    position: "absolute",
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    borderWidth: STROKE,
  },
  ringBg: {
    borderColor: "#E0E0E0",
  },
  ringClipRight: {
    position: "absolute",
    left: SIZE / 2,
    width: SIZE / 2,
    height: SIZE,
    overflow: "hidden",
  },
  ringClipLeft: {
    position: "absolute",
    left: 0,
    width: SIZE / 2,
    height: SIZE,
    overflow: "hidden",
  },
  ringFg: {
    borderRightColor: "transparent",
    borderBottomColor: "transparent",
    borderLeftColor: "transparent",
  },
  ringOffsetRight: {
    left: -SIZE / 2,
  },
  ringFgLeft: {
    borderTopColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "transparent",
  },
  percentOverlay: {
    position: "absolute",
    width: SIZE,
    height: SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  percent: {
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
});
