import React from "react";
import { View } from "react-native";

import { Controller, get, useFormContext, useFormState } from "react-hook-form";
import { HelperText, TextInput, TextInputProps } from "react-native-paper";

import { grayColor } from "@/constants/theme";
import { formatPhoneNumber } from "@/utils";

interface PhoneNumberInputProps extends Omit<TextInputProps, "keyboardType"> {
  label?: string;
  name: string;
}

export const PhoneNumberInput = ({
  name,
  mode = "outlined",
  ...props
}: PhoneNumberInputProps) => {
  const form = useFormContext();

  // Always get the latest error from useFormState directly
  const error = get(
    useFormState({ control: form.control, name }).errors,
    name
  )?.message;

  return (
    <Controller
      control={form.control}
      name={name}
      render={({ field: { onChange, onBlur, value } }) => (
        <View style={{ width: "100%" }}>
          <TextInput
            onBlur={onBlur}
            onChangeText={(value) => onChange(formatPhoneNumber(value))}
            value={value}
            placeholderTextColor={grayColor}
            mode={mode}
            {...props}
            style={[
              { backgroundColor: mode === "flat" ? "transparent" : undefined },
              props.style,
            ]}
            keyboardType="number-pad"
            error={!!error}
          />
          <HelperText type="error">{error?.toString()}</HelperText>
        </View>
      )}
    />
  );
};
