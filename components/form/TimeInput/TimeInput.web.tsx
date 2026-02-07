import React, { useRef } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { Controller, get, useFormContext, useFormState } from "react-hook-form";
import { HelperText, TextInput } from "react-native-paper";

interface TimeInputProps {
  label?: string;
  name: string;
  minimumDate?: Date;
  maximumDate?: Date;
  placeholder?: string;
  mode?: "outlined" | "flat";
}

// Formats a user-friendly time string using user's locale
function formatUserFriendlyTime(date?: Date) {
  // Example: 3:05 PM
  return date?.toLocaleString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

export const TimeInput = ({
  label,
  name,
  minimumDate,
  maximumDate,
  placeholder,
  mode = "outlined",
}: TimeInputProps) => {
  const form = useFormContext();
  const ref = useRef<HTMLInputElement>(null);

  // Always get the latest error from useFormState directly
  const error = get(
    useFormState({ control: form.control, name }).errors,
    name
  )?.message;

  return (
    <Controller
      control={form.control}
      name={name}
      render={({ field: { value } }) => (
        <View style={{ width: "100%" }}>
          <TextInput
            left={<TextInput.Icon icon="clock" size={24} />}
            label={label}
            value={formatUserFriendlyTime(value)}
            placeholder={placeholder}
            readOnly
            mode={mode}
            style={{
              paddingRight: 30,
              backgroundColor: mode === "flat" ? "transparent" : undefined,
            }}
            error={!!error}
          />
          <input
            ref={ref}
            type="time"
            min={
              minimumDate ? minimumDate.toISOString().slice(11, 16) : undefined
            }
            max={
              maximumDate ? maximumDate.toISOString().slice(11, 16) : undefined
            }
            style={{
              // Visually hide the input, but keep it accessible for programmatic clicks
              opacity: 0,
              position: "absolute",
              pointerEvents: "none",
              width: 0,
              height: 0,
            }}
            onChange={(e) => {
              const val = e.target.value;
              // val will be "HH:mm" -- HTML5 <input type="time">
              if (val) {
                const [hour, minute] = val.split(":");
                // Compose date object using today's date but picked hour/minute
                const now = value instanceof Date ? value : new Date();
                const pickedDate = new Date(
                  now.getFullYear(),
                  now.getMonth(),
                  now.getDate(),
                  Number(hour),
                  Number(minute)
                );
                form.setValue(name, pickedDate, {
                  shouldValidate: true,
                  shouldDirty: true,
                });
              }
            }}
            tabIndex={-1}
            aria-hidden="true"
          />
          {/* Overlay a transparent Pressable to capture all touches */}
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() =>
              ref.current?.showPicker
                ? ref.current.showPicker()
                : ref.current?.click()
            }
            accessibilityRole="button"
            accessibilityLabel={label || name}
          />
          <HelperText type="error">{error?.toString()}</HelperText>
        </View>
      )}
    />
  );
};
