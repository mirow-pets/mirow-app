import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { router } from "expo-router";
import { useTheme } from "react-native-paper";
import { Pie, PolarChart } from "victory-native";

import { grayColor } from "@/constants/theme";
import { useAuth } from "@/hooks/use-auth";
import { UserRole } from "@/types";

export interface CompleteAccountSetupProps {
  progress: number; // value between 0 and 1, i.e., 0.67 for 67%
}

export const CompleteAccountSetup = ({
  progress,
}: CompleteAccountSetupProps) => {
  const theme = useTheme();
  const { userRole } = useAuth();

  const handlePress = () => {
    router.replace(`/${userRole as UserRole}/account`);
  };

  return (
    <TouchableOpacity
      style={[styles.banner, { borderColor: theme.colors.primary }]}
      onPress={handlePress}
    >
      <View style={styles.donutContainer}>
        <View style={{ height: 56, width: 56 }}>
          <PolarChart
            data={[
              {
                label: "",
                value: 100 - progress,
                color: grayColor,
              },
              {
                label: "",
                value: progress,
                color: theme.colors.primary,
              },
            ]} // 👈 specify your data
            labelKey={"label"} // 👈 specify data key for labels
            valueKey={"value"} // 👈 specify data key for values
            colorKey={"color"}
          >
            <Pie.Chart innerRadius={"80%"} />
          </PolarChart>
        </View>
        <View style={styles.percentOverlay}>
          <Text style={[styles.percent, { color: theme.colors.primary }]}>
            {progress}%
          </Text>
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
  percentOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  percent: {
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
});
