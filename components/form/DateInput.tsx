import React, { useState } from "react";
import { TouchableOpacity } from "react-native";

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

function formatUserFriendlyDate(date?: Date) {
  // Format: Sep 28, 2024 (use user's locale)
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
        <TouchableOpacity
          onPress={() => setOpen(true)}
          style={{ width: "100%" }}
        >
          <TextInput
            label={label}
            value={formatUserFriendlyDate(value)}
            placeholder={placeholder}
            readOnly
            style={{
              paddingRight: 30,
              backgroundColor: inputMode === "flat" ? "transparent" : undefined,
            }}
            error={!!error}
            mode={inputMode}
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
            display="spinner"
          />
          <HelperText type="error">{error?.toString()}</HelperText>
        </TouchableOpacity>
      )}
    />
  );
};
