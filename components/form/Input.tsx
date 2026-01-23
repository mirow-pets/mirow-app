import React from "react";
import { StyleSheet, TextInput, TextInputProps, View } from "react-native";

import { Controller, get, useFormContext, useFormState } from "react-hook-form";

import { ThemedText } from "@/components/themed-text";
import { blackColor, grayColor, redColor, whiteColor } from "@/constants/theme";

interface InputProps extends TextInputProps {
  label?: string;
  name: string;
  formatter?: (_value: string) => string;
}

export const Input = ({ label, name, formatter, ...props }: InputProps) => {
  const form = useFormContext();

  // Always get the latest error from useFormState directly
  const error = get(useFormState({ control: form.control, name }).errors, name)?.message;

  return (
    <View style={{ width: "100%" }}>
      {label && <ThemedText style={styles.label}>{label}</ThemedText>}
      <View>
        <Controller
          control={form.control}
          name={name}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              onBlur={onBlur}
              value={value?.toString()}
              placeholderTextColor={grayColor}
              {...props}
              onChangeText={(value) => {
                const formatted = formatter ? formatter(value) : value;
                onChange(formatted);
                props.onChangeText?.(formatted);
              }}
              style={[styles.input, props.style]}
            />
          )}
        ></Controller>
      </View>
      <ThemedText style={styles.errorText}>
        {error?.toString()}
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    marginBottom: 5,
  },
  input: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: whiteColor,
    fontWeight: 600,
    fontSize: 16,
    boxShadow: "inset 0px 3px 4px rgba(0, 0, 0, 0.5)",
    color: blackColor,
  },
  errorText: {
    color: redColor,
    fontSize: 12,
    height: 16,
  },
});
