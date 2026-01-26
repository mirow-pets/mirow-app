import React, { ReactNode, useState } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import Slider, { SliderProps } from "@react-native-community/slider";
import { Controller, get, useFormContext, useFormState } from "react-hook-form";
import { useTheme } from "react-native-paper";

import { ThemedText } from "@/components/themed-text";
import { blackColor, redColor } from "@/constants/theme";

interface SliderInputProps extends SliderProps {
  label?: string;
  name: string;
  style?: StyleProp<ViewStyle>;
  actions?: ReactNode;
}

export const SliderInput = ({
  label,
  name,
  actions,
  ...props
}: SliderInputProps) => {
  const theme = useTheme();
  const form = useFormContext();
  const [, setValue] = useState(0);

  // Always get the latest error from useFormState directly
  const error = get(
    useFormState({ control: form.control, name }).errors,
    name
  )?.message;

  return (
    <View style={{ width: "100%" }}>
      {label && (
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <ThemedText style={styles.label}>{label}</ThemedText>
          {actions}
        </View>
      )}
      <View>
        <Controller
          control={form.control}
          name={name}
          render={({ field: { onChange, onBlur, value } }) => (
            <Slider
              onBlur={onBlur}
              value={value}
              {...props}
              style={[styles.input, props.style]}
              onValueChange={setValue}
              onSlidingComplete={onChange}
              thumbTintColor={theme.colors.primary}
              minimumTrackTintColor={theme.colors.primary}
            />
          )}
        ></Controller>
      </View>
      <ThemedText style={styles.errorText}>{error?.toString()}</ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    marginBottom: 1,
  },
  input: {
    paddingVertical: 8,
    color: blackColor,
  },
  errorText: {
    color: redColor,
    fontSize: 12,
    height: 16,
  },
});
