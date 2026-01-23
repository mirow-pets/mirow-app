import React, { useRef, useState } from "react";

import { Searchbar } from "react-native-paper";

import { grayColor } from "@/constants/theme";

interface SearchInputProps {
  value?: string;
  placeholder?: string;
  onChange: (_value: string) => void;
}

export const SearchInput = ({
  value: _value,
  placeholder,
  onChange,
}: SearchInputProps) => {
  const [value, setValue] = useState(_value || "");
  const timeoutRef = useRef(setTimeout(() => {}, 0));

  const handleChangeText = (text: string) => {
    setValue(text);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => onChange(text), 300);
  };

  return (
    <Searchbar
      value={value}
      onChangeText={handleChangeText}
      placeholder={placeholder ?? "Search..."}
      placeholderTextColor={grayColor}
    />
  );
};
