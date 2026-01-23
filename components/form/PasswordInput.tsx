import React, { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";
import { Controller, get, useFormContext, useFormState } from "react-hook-form";
import { HelperText, TextInput, TextInputProps } from "react-native-paper";

import { grayColor } from "@/constants/theme";

interface PasswordInputProps extends Omit<TextInputProps, "secureTextEntry"> {
  label?: string;
  name: string;
}

export const PasswordInput = ({
  name,
  mode = "outlined",
  ...props
}: PasswordInputProps) => {
  const form = useFormContext();

  // Always get the latest error from useFormState directly
  const error = get(
    useFormState({ control: form.control, name }).errors,
    name
  )?.message;

  // 1. State to manage password visibility
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // Function to toggle visibility
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  // Determine the icon name based on visibility state
  const iconName = isPasswordVisible ? "eye-off" : "eye";

  return (
    <Controller
      control={form.control}
      name={name}
      render={({ field: { onChange, onBlur, value } }) => (
        <View style={{ width: "100%" }}>
          <View style={styles.inputContainer}>
            <TextInput
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholderTextColor={grayColor}
              mode={mode}
              {...props}
              secureTextEntry={!isPasswordVisible}
              keyboardType="default"
              autoCapitalize="none"
              style={[
                {
                  paddingRight: 30,
                  width: "100%",
                  backgroundColor: mode === "flat" ? "transparent" : undefined,
                },
                props.style,
              ]}
              error={!!error}
            />
            <Pressable
              onPress={togglePasswordVisibility}
              style={styles.iconButton}
            >
              <Ionicons name={iconName} size={20} color="gray" />
            </Pressable>
          </View>
          <HelperText type="error">{error?.toString()}</HelperText>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  label: {
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: "row",
    position: "relative",
    width: "100%",
  },
  iconButton: {
    padding: 4,
    marginRight: 8,
    position: "absolute",
    right: 4,
    top: "50%",
    transform: [{ translateY: "-50%" }],
  },
});
