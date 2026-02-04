import React, { useRef, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { Controller, get, useFormContext, useFormState } from "react-hook-form";
import DateTimePickerModal, {
  DateTimePickerProps,
} from "react-native-modal-datetime-picker";
import { HelperText, TextInput } from "react-native-paper";

interface DateInputProps
  extends Omit<DateTimePickerProps, "onConfirm" | "onCancel"> {
  label?: string;
  name: string;
  placeholder?: string;
  inputMode?: "outlined" | "flat";
}

// Format date as per user's locale
function formatUserFriendlyDate(date?: Date) {
  return date?.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export const DateInput = ({
  label,
  name,
  placeholder,
  inputMode = "outlined",
  ...props
}: DateInputProps) => {
  const form = useFormContext();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  // Always get the latest error from useFormState directly
  const error = get(
    useFormState({ control: form.control, name }).errors,
    name
  )?.message;

  /**
   * Explanation:
   * The original usage of TouchableOpacity wraps TextInput,
   * but the react-native-paper TextInput is implemented natively and
   * handles its own touch events—so it often blocks touch events from
   * propagating up to TouchableOpacity.
   *
   * Solution: Make TextInput non-interactive, and overlay a transparent
   * Pressable/View to capture touches, or use the pointerEvents property.
   *
   * Alternatively, disable TextInput's editable prop and handle `onPressIn` on TextInput directly.
   * Here's an approach using the TextInput's own onPressIn, which is
   * supported by react-native-paper v5+ (if not, use the overlay approach).
   */
  return (
    <Controller
      control={form.control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <View style={{ width: "100%" }}>
          <TextInput
            left={<TextInput.Icon icon="calendar" size={24} />}
            label={label}
            value={formatUserFriendlyDate(value)}
            placeholder={placeholder}
            mode={inputMode}
            error={!!error}
            style={{
              paddingRight: 30,
              backgroundColor: inputMode === "flat" ? "transparent" : undefined,
            }}
            editable={false} // Make sure the input isn't actually focusable
            pointerEvents="none" // Prevent TextInput from capturing touch
          />
          <input
            ref={ref}
            type="date"
            style={{
              // Visually hide the input, but keep it accessible for programmatic clicks
              opacity: 0,
              position: "absolute",
              pointerEvents: "none",
              width: 0,
              height: 0,
            }}
            // Open the browser date picker when value is changed
            onChange={(e) => {
              // Parse the date in yyyy-mm-dd format to Date object
              const val = e.target.value;
              if (val) {
                // Ensure user's time zone is set to local midnight
                const [year, month, day] = val.split("-");
                const pickedDate = new Date(
                  Number(year),
                  Number(month) - 1,
                  Number(day)
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
          <DateTimePickerModal
            {...props}
            isVisible={open}
            mode="date"
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
