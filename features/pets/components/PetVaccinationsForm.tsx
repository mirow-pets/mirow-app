import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFormContext } from "react-hook-form";

import { whiteColor } from "@/constants/theme";
import { TPetVaccination } from "@/types/pets";

import { AddVaccineModal } from "./AddVaccineModal";

export const PetVaccinationsForm = () => {
  const form = useFormContext<{ petVaccinations: TPetVaccination[] }>();

  const petVaccinations = form.watch("petVaccinations");

  const handleRemoveVaccine = (index: number) => {
    const vaccinations = petVaccinations.filter((_, i) => i !== index);
    form.setValue("petVaccinations", vaccinations);
  };

  return (
    <>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text>Vaccines</Text>
        <AddVaccineModal
          onAdded={(vaccine) =>
            form.setValue("petVaccinations", [...petVaccinations, vaccine])
          }
        />
      </View>
      <View style={{ gap: 8 }}>
        {petVaccinations.map((vaccine, i) => (
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
