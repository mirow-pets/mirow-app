import React from "react";
import { Platform, StyleSheet, Text, TextInputProps, View } from "react-native";

import { Controller, get, useFormContext, useFormState } from "react-hook-form";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";

import { ThemedText } from "@/components/themed-text";
import { blackColor, redColor, whiteColor } from "@/constants/theme";

const CELL_COUNT = 4;
const autoComplete = Platform.select<TextInputProps["autoComplete"]>({
  default: "one-time-code",
});

interface OtpInputProps extends TextInputProps {
  label?: string;
  name: string;
  formatter?: (_value: string) => string;
}

export const OtpInput = ({
  label,
  name,
  formatter,
  ...props
}: OtpInputProps) => {
  const form = useFormContext();
  const { errors } = useFormState({ control: form.control, name });
  const ref = useBlurOnFulfill({ value: props.value, cellCount: CELL_COUNT });

  const setValue = (value: string) => form.setValue(name, value);

  const [field, getCellOnLayoutHandler] = useClearByFocusCell({
    value: form.watch(name),
    setValue,
  });

  // Always get the latest error from useFormState directly
  const error = get(useFormState({ control: form.control, name }).errors, name)?.message;

  return (
    <View style={{ width: "100%" }}>
      {label && <ThemedText style={styles.label}>{label}</ThemedText>}
      <View>
        <Controller
          control={form.control}
          name={name}
          render={({ field: { onChange, value } }) => (
            <CodeField
              ref={ref}
              {...field}
              value={value}
              onChangeText={onChange}
              cellCount={CELL_COUNT}
              rootStyle={styles.codeFieldRoot}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              autoComplete={autoComplete}
              renderCell={({ index, symbol, isFocused }) => (
                <Text
                  key={index}
                  style={[styles.cell, isFocused && styles.focusCell]}
                  onLayout={getCellOnLayoutHandler(index)}
                >
                  {symbol || (isFocused && <Cursor />)}
                </Text>
              )}
            />
          )}
        ></Controller>
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

  root: { flex: 1, padding: 20 },
  title: { textAlign: "center", fontSize: 30 },
  codeFieldRoot: {
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  cell: {
    width: 48,
    height: 56,
    lineHeight: 56,
    fontSize: 32,
    borderWidth: 1,
    borderColor: "#00000030",
    borderRadius: 8,
    textAlign: "center",
    color: "#000", // text color
    backgroundColor: whiteColor,
  },
  focusCell: {
    borderColor: "#000",
  },
});
