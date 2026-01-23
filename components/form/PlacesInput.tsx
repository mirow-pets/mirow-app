import React from "react";
import { StyleSheet, View } from "react-native";

import { Controller, get, useFormContext, useFormState } from "react-hook-form";
import { HelperText, TextInputProps, useTheme } from "react-native-paper";

import { ThemedText } from "@/components/themed-text";
import { blackColor, grayColor, whiteColor } from "@/constants/theme";

import { PlaceAutoComplete } from "./PlaceAutoComplete";

interface PlacesInputProps extends TextInputProps {
  label?: string;
}

export const PlacesInput = ({
  label,
  mode = "outlined",
  ...props
}: PlacesInputProps) => {
  const theme = useTheme();
  const form = useFormContext();
  const [focused, setFocused] = React.useState(false);

  // Always get the latest error from useFormState directly
  const error = get(
    useFormState({ control: form.control, name: "city" }).errors,
    "city"
  )?.message;

  return (
    <View style={{ width: "100%", minHeight: 56 }}>
      {label && <ThemedText style={styles.label}>{label}</ThemedText>}
      <View>
        <Controller
          control={form.control}
          name={"city"}
          render={({ field: { onBlur, value } }) => (
            <PlaceAutoComplete
              onBlur={() => {
                onBlur();
                setFocused(false);
              }}
              onFocus={() => setFocused(true)}
              value={value}
              placeholderTextColor={grayColor}
              {...props}
              style={[
                mode === "outlined" ? styles.outlinedInput : styles.flatInput,
                props.style,
                error ? { borderColor: theme.colors.error } : {},
                focused ? { borderColor: theme.colors.primary } : {},
              ]}
              onChange={({ city, state, country }) => {
                form.setValue("city", city, { shouldValidate: true });
                form.setValue("state", state);
                form.setValue("country", country);
              }}
            />
          )}
        />
      </View>
      <HelperText type="error">{error?.toString()}</HelperText>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    marginBottom: 5,
  },
  outlinedInput: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 4,
    backgroundColor: whiteColor,
    borderWidth: 2,
    borderColor: "#C4C4C4",
    fontSize: 16,
    minHeight: 56,
    color: blackColor,
  },
  flatInput: {
    paddingHorizontal: 0,
    paddingVertical: 12,
    borderRadius: 4,
    backgroundColor: "transparent",
    borderWidth: 0,
    borderBottomWidth: 1.5,
    borderColor: "#C4C4C4",
    fontSize: 16,
    minHeight: 56,
    color: blackColor,
  },
});
