import React from "react";
import { StyleSheet, View } from "react-native";

import {
  Controller,
  ControllerRenderProps,
  FieldValues,
  get,
  useFormContext,
  useFormState,
} from "react-hook-form";

import { ThemedText } from "@/components/themed-text";
import { blackColor, redColor, whiteColor } from "@/constants/theme";

interface FormFieldProps {
  label?: string;
  name: string;
  render: (_input: {
    field: ControllerRenderProps<FieldValues, string>;
  }) => React.ReactElement;
}

export const FormField = ({ label, name, render }: FormFieldProps) => {
  const form = useFormContext();

  // Always get the latest error from useFormState directly
  const error = get(useFormState({ control: form.control, name }).errors, name)?.message;

  return (
    <View style={{ width: "100%" }}>
      {label && <ThemedText style={styles.label}>{label}</ThemedText>}
      <View>
        <Controller control={form.control} name={name} render={render} />
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
