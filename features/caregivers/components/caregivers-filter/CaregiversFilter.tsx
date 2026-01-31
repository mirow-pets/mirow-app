import React from "react";
import { View } from "react-native";

import { SearchInput } from "@/components/form/SearchInput";
import { TCaregiversFilter } from "@/types/caregivers";

import { CaregiversFilterModal } from "./CaregiversFilterModal";

export interface CaregiversFilterProps {
  petName?: string;
  disabledFields?: (keyof TCaregiversFilter)[];
  filter: TCaregiversFilter;
  onChange: (_filter: TCaregiversFilter) => void;
}

export const CaregiversFilter = ({
  petName,
  disabledFields,
  filter: filter,
  onChange,
}: CaregiversFilterProps) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
      }}
    >
      <View style={{ flex: 1 }}>
        <SearchInput
          value={filter.search}
          onChange={(search) => onChange({ ...filter, search })}
        />
      </View>
      <CaregiversFilterModal
        petName={petName}
        disabledFields={disabledFields}
        filter={filter}
        onChange={onChange}
      />
    </View>
  );
};
