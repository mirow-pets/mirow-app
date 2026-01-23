import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { Controller, get, useFormContext, useFormState } from "react-hook-form";
import { HelperText, TextInput, TextInputProps } from "react-native-paper";
import SelectDropdown from "react-native-select-dropdown";

import { grayColor } from "@/constants/theme";

interface DropdownInputProps {
  label?: string;
  name: string;
  options: { label: string; value?: string | number | boolean }[];
  placeholder?: string;
  value?: unknown;
  onChange?: (value: unknown) => void;
  disabled?: boolean;
  inputStyle?: TextInputProps["style"];
  mode?: "flat" | "outlined";
}

export const DropdownInput = ({
  label,
  name,
  options,
  placeholder,
  value: _value,
  onChange: _onChange,
  disabled,
  inputStyle,
  mode = "outlined",
}: DropdownInputProps) => {
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
          <SelectDropdown
            searchPlaceHolderColor={grayColor}
            defaultValue={options.find(
              (option) => option.value === (_value || value)
            )}
            disabled={disabled}
            data={options}
            onBlur={onBlur}
            onSelect={(selectedItem) =>
              _onChange
                ? _onChange(selectedItem.value)
                : onChange(selectedItem.value)
            }
            renderButton={(selectedItem, isOpened) => (
              <View style={styles.input}>
                <TextInput
                  label={label}
                  value={selectedItem?.label}
                  placeholder={placeholder}
                  readOnly
                  style={[
                    {
                      paddingRight: 30,
                      backgroundColor:
                        mode === "flat" ? "transparent" : undefined,
                    },
                    inputStyle,
                  ]}
                  error={!!error}
                  mode={mode}
                />
                <Ionicons
                  name={isOpened ? "chevron-up" : "chevron-down"}
                  style={styles.dropdownButtonArrowStyle}
                />
              </View>
            )}
            renderItem={(item, index, isSelected) => {
              return (
                <View
                  style={{
                    ...styles.dropdownItemStyle,
                    ...(isSelected && { backgroundColor: "#D2D9DF" }),
                  }}
                >
                  <Text style={styles.dropdownItemTxtStyle}>{item.label}</Text>
                </View>
              );
            }}
            showsVerticalScrollIndicator={false}
            dropdownStyle={styles.dropdownMenuStyle}
          />
          <HelperText type="error">{error?.toString()}</HelperText>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  label: {
    marginBottom: 5,
  },
  input: {
    position: "relative",
  },
  dropdownButtonStyle: {
    width: 200,
    height: 50,
    backgroundColor: "#E9ECEF",
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  dropdownButtonArrowStyle: {
    fontSize: 16,
    position: "absolute",
    right: 16,
    top: "50%",
    transform: [{ translateY: "-50%" }],
  },
  dropdownMenuStyle: {
    borderRadius: 8,
  },
  dropdownItemStyle: {
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },
  dropdownItemTxtStyle: {
    flex: 1,
  },
});
