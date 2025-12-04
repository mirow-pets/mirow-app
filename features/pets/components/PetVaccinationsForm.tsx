import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

import FontAwesome from "@expo/vector-icons/FontAwesome";

import { whiteColor } from "@/constants/theme";
import { TPetVaccination } from "@/types/pets";

import { AddVaccineModal } from "./AddVaccineModal";

export interface PetVaccinationsFormProps {
  value: TPetVaccination[];
  onChange: (_value: TPetVaccination[]) => void;
}

export const PetVaccinationsForm = ({
  value,
  onChange,
}: PetVaccinationsFormProps) => {
  const handleRemoveVaccine = (index: number) => {
    const vaccinations = value.filter((_, i) => i !== index);
    onChange(vaccinations);
  };

  return (
    <>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text>Vaccines</Text>
        <AddVaccineModal onAdded={(vaccine) => onChange([...value, vaccine])} />
      </View>
      <View style={{ gap: 8 }}>
        {value.map((vaccine, i) => (
          <View
            key={i}
            style={{
              position: "relative",
              backgroundColor: whiteColor,
              padding: 16,
            }}
          >
            <TouchableOpacity
              onPress={() => handleRemoveVaccine(i)}
              style={{ position: "absolute", top: 8, right: 8 }}
            >
              <FontAwesome name="remove" size={24} color="black" />
            </TouchableOpacity>
            <Text>Name: {vaccine.vaccineName}</Text>
            <Text>Given At: {vaccine.vaccinatedAt.toDateString()}</Text>
            <Text>Due Date: {vaccine.nextDueDate.toDateString()}</Text>
          </View>
        ))}
      </View>
    </>
  );
};
