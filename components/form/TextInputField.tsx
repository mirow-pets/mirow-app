import React from "react";
import { View } from "react-native";

import { Controller, get, useFormContext, useFormState } from "react-hook-form";
import { HelperText, TextInput, TextInputProps } from "react-native-paper";

export interface TextInputFieldProps extends TextInputProps {
  label?: string;
  name: string;
  formatter?: (_value: string) => string;
}

export const TextInputField = ({
  name,
  formatter,
  mode = "outlined",
  ...props
}: TextInputFieldProps) => {
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
            value={value?.toString()}
            {...props}
            mode={mode}
            onChangeText={(value) => {
              const formatted = formatter ? formatter(value) : value;
              onChange(formatted);
              props.onChangeText?.(formatted);
            }}
            style={[
              { backgroundColor: mode === "flat" ? "transparent" : undefined },
              props.style,
            ]}
            error={!!error}
          />
          <HelperText type="error">{error?.toString()}</HelperText>
        </View>
      )}
    />
  );
};
