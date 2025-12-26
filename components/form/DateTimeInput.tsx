import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Controller, useFormContext, useFormState } from "react-hook-form";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import { ThemedText } from "@/components/themed-text";
import { blackColor, redColor, whiteColor } from "@/constants/theme";

interface DateTimeInputProps {
  label?: string;
  name: string;
  minimumDate?: Date;
  maximumDate?: Date;
}

// Formats a user-friendly date and time string using user's locale
function formatUserFriendlyDateTime(date?: Date) {
  if (!date) return "-";
  // Example: Sep 28, 2024, 3:05 PM
  return date.toLocaleString(undefined, {
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
}: DateTimeInputProps) => {
  const form = useFormContext();
  const { errors } = useFormState({ control: form.control, name });
  const [open, setOpen] = useState(false);

  const error = errors[name];

  return (
    <View style={{ width: "100%" }}>
      {label && <ThemedText style={styles.label}>{label}</ThemedText>}
      <View>
        <Controller
          control={form.control}
          name={name}
          render={({ field: { onChange, value } }) => (
            <TouchableOpacity onPress={() => setOpen(true)}>
              <View style={styles.input}>
                <Text>{formatUserFriendlyDateTime(value)}</Text>
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
              </View>
            </TouchableOpacity>
          )}
        ></Controller>
      </View>
      <ThemedText style={styles.errorText}>
        {error?.message?.toString()}
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
});
