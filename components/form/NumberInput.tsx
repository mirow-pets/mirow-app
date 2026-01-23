import React from "react";
import { View } from "react-native";

import { Controller, get, useFormContext, useFormState } from "react-hook-form";
import { HelperText, TextInput, TextInputProps } from "react-native-paper";

import { grayColor } from "@/constants/theme";
import { formatNumber } from "@/utils";

interface NumberInputProps extends Omit<TextInputProps, "keyboardType"> {
  label?: string;
  name: string;
}

export const NumberInput = ({
  name,
  mode = "outlined",
  ...props
}: NumberInputProps) => {
  const form = useFormContext();

  // Always get the latest error from useFormState directly
  const error = get(
    useFormState({ control: form.control, name }).errors,
    name,
  )?.message;

  return (
    <Controller
      control={form.control}
      name={name}
      render={({ field: { onChange, onBlur, value } }) => (
        <View style={{ width: "100%" }}>
          <TextInput
            onBlur={onBlur}
            onChangeText={(value) => onChange(formatNumber(value))}
            value={value?.toString()}
            placeholderTextColor={grayColor}
            mode={mode}
            {...props}
            style={props.style}
            keyboardType="number-pad"
            error={!!error}
          />
          <HelperText type="error">{error?.toString()}</HelperText>
        </View>
      )}
    />
  );
};
