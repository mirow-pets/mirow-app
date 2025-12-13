import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { Controller, useFormContext, useFormState } from "react-hook-form";
import SelectDropdown from "react-native-select-dropdown";

import { ThemedText } from "@/components/themed-text";
import { blackColor, grayColor, redColor, whiteColor } from "@/constants/theme";

interface DropdownInputProps {
  label?: string;
  name: string;
  options: { label: string; value?: string | number | boolean }[];
  placeholder?: string;
}

export const DropdownInput = ({
  label,
  name,
  options,
  placeholder,
}: DropdownInputProps) => {
  const form = useFormContext();
  const { errors } = useFormState({ control: form.control, name });

  const error = errors[name];

  return (
    <View>
      {label && <ThemedText style={styles.label}>{label}</ThemedText>}
      <View>
        <Controller
          control={form.control}
          name={name}
          render={({ field: { onChange, onBlur, value } }) => (
            <SelectDropdown
              searchPlaceHolderColor={grayColor}
              defaultValue={options.find((option) => option.value === value)}
              data={options}
              onBlur={onBlur}
              onSelect={(selectedItem) => onChange(selectedItem.value)}
              renderButton={(selectedItem, isOpened) => (
                <View style={styles.input}>
                  {selectedItem ? (
                    <Text style={styles.dropdownButtonTxtStyle}>
                      {selectedItem.label}
                    </Text>
                  ) : (
                    <Text style={styles.dropdownPlaceholderTxtStyle}>
                      {placeholder}
                    </Text>
                  )}
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
                    <Text style={styles.dropdownItemTxtStyle}>
                      {item.label}
                    </Text>
                  </View>
                );
              }}
              showsVerticalScrollIndicator={false}
              dropdownStyle={styles.dropdownMenuStyle}
            />
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
    flexDirection: "row",
    fontFamily: "Poppins-Bold",
    alignItems: "center",
    color: blackColor,
  },
  errorText: {
    color: redColor,
    fontSize: 12,
    height: 16,
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
  dropdownButtonTxtStyle: {
    flex: 1,
    fontFamily: "Poppins-Bold",
  },
  dropdownPlaceholderTxtStyle: {
    flex: 1,
    color: "#00000088",
    fontFamily: "Poppins-Bold",
  },
  dropdownButtonArrowStyle: {
    fontSize: 16,
  },
  dropdownButtonIconStyle: {
    fontSize: 16,
    marginRight: 8,
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
  dropdownItemIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
});
