import React, { ReactNode, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { Entypo } from "@expo/vector-icons";

import { ThemedText } from "@/components/themed-text";

export interface CaregiversFilterCollapsibleProps {
  title: string;
  children: ReactNode;
  initiallyOpen?: boolean;
}

export const CaregiversFilterCollapsible = ({
  title,
  children,
  initiallyOpen = false,
}: CaregiversFilterCollapsibleProps) => {
  const [open, setOpen] = useState(initiallyOpen);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.header}
        onPress={() => setOpen((o) => !o)}
      >
        <ThemedText style={styles.title}>{title}</ThemedText>
        <Entypo
          name={open ? "chevron-up" : "chevron-down"}
          size={20}
          color="#1E90FF"
        />
      </TouchableOpacity>
      {open ? <View style={styles.content}>{children}</View> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: "#F7F9FB",
    overflow: "hidden",
  },
  header: {
    padding: 8,
    paddingRight: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#e0e0e0",
  },
  title: {
    fontWeight: "600",
    fontSize: 16,
    color: "#333",
  },
  content: {
    padding: 14,
    paddingTop: 6,
  },
});
