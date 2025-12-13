import React from "react";
import { StyleSheet, TextInputProps, View } from "react-native";

import { Controller, useFormContext, useFormState } from "react-hook-form";

import { ThemedText } from "@/components/themed-text";
import { blackColor, grayColor, redColor, whiteColor } from "@/constants/theme";

import { PlaceAutoComplete } from "./PlaceAutoComplete";

interface PlacesInputProps extends TextInputProps {
  label?: string;
}

export const PlacesInput = ({ label, ...props }: PlacesInputProps) => {
  const form = useFormContext();
  const { errors } = useFormState({ control: form.control, name: "city" });

  const error = errors["city"];

  return (
    <View style={{ width: "100%", minHeight: 56 }}>
      {label && <ThemedText style={styles.label}>{label}</ThemedText>}
      <View>
        <Controller
          control={form.control}
          name={"city"}
          render={({ field: { onBlur, value } }) => (
            <PlaceAutoComplete
              onBlur={onBlur}
              value={value}
              placeholderTextColor={grayColor}
              {...props}
              style={[styles.input, props.style]}
              onChange={({ city, state, country }) => {
                form.setValue("city", city, { shouldValidate: true });
                form.setValue("state", state);
                form.setValue("country", country);
              }}
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
    borderWidth: 0,
    minHeight: 56,
    color: blackColor,
  },
  errorText: {
    color: redColor,
    fontSize: 12,
    height: 16,
  },
});
