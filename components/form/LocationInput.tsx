import React from "react";
import { StyleSheet, View } from "react-native";

import { Controller, get, useFormContext, useFormState } from "react-hook-form";
import { HelperText, TextInputProps, useTheme } from "react-native-paper";

import { ThemedText } from "@/components/themed-text";
import { whiteColor } from "@/constants/theme";

import { PlaceAutoComplete } from "./PlaceAutoComplete";

export interface LocationValue {
  lat: number;
  lng: number;
  addressText: string;
}

export interface LocationInputProps extends Omit<TextInputProps, "onChange"> {
  name: "pickup" | "dropOff" | string;
  label?: string;
  mode?: "outlined" | "flat";
}

export const LocationInput = ({
  name,
  label,
  mode = "outlined",
  ...props
}: LocationInputProps) => {
  const theme = useTheme();
  const form = useFormContext();
  const [focused, setFocused] = React.useState(false);

  const error = get(useFormState({ control: form.control, name }).errors, name)
    ?.message as string | undefined;

  return (
    <View style={{ width: "100%", minHeight: 56 }}>
      {label && <ThemedText style={styles.label}>{label}</ThemedText>}
      <View>
        <Controller
          control={form.control}
          name={name}
          render={({ field: { onBlur, value, onChange } }) => (
            <PlaceAutoComplete
              value={value?.addressText ?? ""}
              placeholder={props.placeholder}
              onBlur={() => {
                onBlur();
                setFocused(false);
              }}
              onFocus={() => setFocused(true)}
              style={[
                mode === "outlined" ? styles.outlinedInput : styles.flatInput,
                props.style,
                error ? { borderColor: theme.colors.error } : {},
                focused ? { borderColor: theme.colors.primary } : {},
              ]}
              onChange={(place) => {
                const { lat, lng, addressText } = place;
                if (lat != null && lng != null && addressText != null) {
                  onChange({ lat, lng, addressText });
                }
              }}
            />
          )}
        />
      </View>
      <HelperText type="error">{error}</HelperText>
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
    color: "#020202",
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
    color: "#020202",
  },
});
