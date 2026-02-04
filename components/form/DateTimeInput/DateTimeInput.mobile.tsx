import React, { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { Controller, get, useFormContext, useFormState } from "react-hook-form";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { HelperText, TextInput } from "react-native-paper";

interface DateTimeInputProps {
  label?: string;
  name: string;
  minimumDate?: Date;
  maximumDate?: Date;
  placeholder?: string;
  mode?: "outlined" | "flat";
}

// Formats a user-friendly date and time string using user's locale
function formatUserFriendlyDateTime(date?: Date) {
  // Example: Sep 28, 2024, 3:05 PM
  return date?.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export const DateTimeInput = ({
  label,
  name,
  minimumDate,
  maximumDate,
  placeholder,
  mode = "outlined",
}: DateTimeInputProps) => {
  const form = useFormContext();

  const [open, setOpen] = useState(false);

  // Always get the latest error from useFormState directly
  const error = get(
    useFormState({ control: form.control, name }).errors,
    name
  )?.message;

  return (
    <Controller
      control={form.control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <View style={{ width: "100%" }}>
          <TextInput
            label={label}
            value={formatUserFriendlyDateTime(value)}
            placeholder={placeholder}
            readOnly
            mode={mode}
            style={{
              paddingRight: 30,
              backgroundColor: mode === "flat" ? "transparent" : undefined,
            }}
            error={!!error}
          />

          {/* Overlay a transparent Pressable to capture all touches */}
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setOpen(true)}
            accessibilityRole="button"
            accessibilityLabel={label || name}
          />
          <DateTimePickerModal
            isVisible={open}
            mode="datetime"
            minimumDate={minimumDate}
            maximumDate={maximumDate}
            onConfirm={(date) => {
              onChange(date);
              setOpen(false);
            }}
            onCancel={() => setOpen(false)}
          />
          <HelperText type="error">{error?.toString()}</HelperText>
        </View>
      )}
    />
  );
};
