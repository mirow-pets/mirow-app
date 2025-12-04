import React from "react";
import { StyleSheet, TextInput, TextInputProps, View } from "react-native";

import { Controller, useFormContext, useFormState } from "react-hook-form";

import { ThemedText } from "@/components/themed-text";
import { redColor, whiteColor } from "@/constants/theme";

interface InputProps extends TextInputProps {
  label?: string;
  name: string;
}

export const Input = ({ label, name, ...props }: InputProps) => {
  const form = useFormContext();
  const { errors } = useFormState({ control: form.control, name });

  const error = errors[name];

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
              onChangeText={onChange}
              value={value?.toString()}
              {...props}
              style={[styles.input, props.style]}
            />
          )}
        ></Controller>
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
  input: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: whiteColor,
    fontWeight: 600,
    fontSize: 16,
    boxShadow: "inset 0px 3px 4px rgba(0, 0, 0, 0.5)",
  },
  errorText: {
    color: redColor,
    fontSize: 12,
    height: 16,
  },
});
