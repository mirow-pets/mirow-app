import React, { useRef, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";

import { grayColor, lightGrayColor } from "@/constants/theme";

interface SearchInputProps {
  value?: string;
  placeholder?: string;
  onChange: (_value: string) => void;
}

export const SearchInput = ({
  value: _value,
  placeholder,
  onChange,
}: SearchInputProps) => {
  const [value, setValue] = useState(_value || "");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChangeText = (text: string) => {
    setValue(text);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => onChange(text), 300);
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={value}
        onChangeText={handleChangeText}
        placeholder={placeholder ?? "Search"}
        placeholderTextColor={grayColor}
        style={styles.input}
      />
      <Ionicons name="search" size={20} color={grayColor} style={styles.icon} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: lightGrayColor,
    borderRadius: 999, // Fully rounded (pill shape)
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 44,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: grayColor,
    padding: 0,
    margin: 0,
  },
  icon: {
    marginLeft: 8,
  },
});
