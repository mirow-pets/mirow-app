import React, { useState } from "react";
import {
  Pressable,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
} from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";
import { Controller, useFormContext, useFormState } from "react-hook-form";
// NOTE: You'll need to install an icon library if you don't have one.
// e.g., using Expo: expo install @expo/vector-icons

import { ThemedText } from "@/components/themed-text";
import { blackColor, grayColor, redColor, whiteColor } from "@/constants/theme";

interface PasswordInputProps extends Omit<TextInputProps, "secureTextEntry"> {
  label?: string;
  name: string;
}

export const PasswordInput = ({
  label,
  name,
  ...props
}: PasswordInputProps) => {
  const form = useFormContext();
  const { errors } = useFormState({ control: form.control, name });

  const error = errors[name];

  // 1. State to manage password visibility
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // Function to toggle visibility
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  // Determine the icon name based on visibility state
  const iconName = isPasswordVisible ? "eye-off" : "eye";

  return (
    <View style={{ width: "100%" }}>
      {label && <ThemedText style={styles.label}>{label}</ThemedText>}
      {/* 3. Wrapper for TextInput and Icon */}
      <View style={styles.inputContainer}>
        <Controller
          control={form.control}
          name={name}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholderTextColor={grayColor}
              {...props}
              // 4. Conditional secureTextEntry
              secureTextEntry={!isPasswordVisible}
              // Set keyboard type and auto-caps explicitly for password fields
              keyboardType="default"
              autoCapitalize="none"
              style={[styles.input, props.style]}
            />
          )}
        />
        {/* 2. Pressable Icon */}
        <Pressable onPress={togglePasswordVisibility} style={styles.iconButton}>
          <Ionicons name={iconName} size={20} color="gray" />
        </Pressable>
      </View>
      <ThemedText style={styles.errorText}>
        {error?.message?.toString()}
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    marginBottom: 5,
  },
  // New style to wrap the TextInput and the icon
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    boxShadow: "inset 0px 3px 4px rgba(0, 0, 0, 0.5)",
    backgroundColor: whiteColor,
    borderRadius: 12,
  },
  input: {
    padding: 16,
    fontWeight: 600,
    flex: 1,
    fontSize: 16,
    color: blackColor,
  },
  iconButton: {
    padding: 4,
    marginRight: 8,
  },
  errorText: {
    color: redColor,
    fontSize: 12,
    height: 16,
  },
});
