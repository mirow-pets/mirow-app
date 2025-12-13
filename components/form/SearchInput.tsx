import React, { useRef } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { blackColor, grayColor, whiteColor } from "@/constants/theme";

interface SearchInputProps {
  value?: string;
  placeholder?: string;
  onChange: (_value: string) => void;
}

export const SearchInput = ({
  value,
  placeholder,
  onChange,
}: SearchInputProps) => {
  const timeoutRef = useRef(setTimeout(() => {}, 0));

  const handleChangeText = (text: string) => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => onChange(text), 300);
  };

  const handleClear = () => {
    clearTimeout(timeoutRef.current);
    onChange("");
  };

  return (
    <View style={styles.container}>
      <TextInput
        defaultValue={value}
        onChangeText={handleChangeText}
        style={styles.input}
        placeholder={placeholder ?? "Search..."}
        placeholderTextColor={grayColor}
      />
      {value ? (
        <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
          <Text style={styles.clearText}>✕</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: whiteColor,
    fontWeight: 600,
    fontSize: 16,
    boxShadow: "inset 0px 3px 4px rgba(0, 0, 0, 0.5)",
  },
  input: {
    flex: 1,
    padding: 16,
    fontWeight: "600",
    fontSize: 16,
    color: blackColor,
  },
  clearButton: {
    marginHorizontal: 8,
    padding: 4,
  },
  clearText: {
    fontSize: 18,
    color: grayColor,
  },
});
