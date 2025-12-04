import React from "react";
import { StyleSheet, TextInput, TextInputProps, View } from "react-native";

import { Controller, useFormContext, useFormState } from "react-hook-form";

import { ThemedText } from "@/components/themed-text";
import { redColor, whiteColor } from "@/constants/theme";
import { formatPhoneNumber } from "@/utils";

interface PhoneNumberInputProps extends Omit<TextInputProps, "keyboardType"> {
  label?: string;
  name: string;
}

export const PhoneNumberInput = ({
  label,
  name,
  ...props
}: PhoneNumberInputProps) => {
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
              onChangeText={(value) => onChange(formatPhoneNumber(value))}
              value={value}
              {...props}
              style={[styles.input, props.style]}
              keyboardType="number-pad"
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
