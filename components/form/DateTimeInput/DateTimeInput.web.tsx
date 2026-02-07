import React, { useRef } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { Controller, get, useFormContext, useFormState } from "react-hook-form";
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

          <input
            ref={ref}
            type="datetime-local"
            min={
              minimumDate ? minimumDate.toISOString().slice(0, 16) : undefined
            }
            max={
              maximumDate ? maximumDate.toISOString().slice(0, 16) : undefined
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
              // val will be "yyyy-MM-ddTHH:mm"
              if (val) {
                // Parse local datetime in browser time zone
                const [fullDate, fullTime] = val.split("T");
                const [year, month, day] = fullDate.split("-");
                const [hour, minute] = fullTime.split(":");
                const pickedDate = new Date(
                  Number(year),
                  Number(month) - 1,
                  Number(day),
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
