import React from "react";
import { StyleSheet, View } from "react-native";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import { Button } from "@/components/button/Button";
import { DropdownInput } from "@/components/form/DropdownInput";
import { Input } from "@/components/form/Input";
import { PetAvatar } from "@/components/image/PetAvatar";
import { primaryColor } from "@/constants/theme";
import { addPetSchema } from "@/features/pets/validations";
import { usePet } from "@/hooks/use-pet";

import { PetVaccinationsForm } from "./PetVaccinationsForm";

export const AddPetForm = () => {
  const {
    addPet,
    isAddingPet,
    petTypeOptions,
    genderOptions,
    weightOptions,
    spayedOrNeuteredOptions,
  } = usePet();

  const form = useForm({
    resolver: zodResolver(addPetSchema),
    defaultValues: {
      petVaccinations: [],
    },
  });

  const petVaccinations = form.watch("petVaccinations");

  return (
    <FormProvider {...form}>
      <View style={styles.container}>
        <View style={{ alignItems: "center", padding: 16 }}>
          <PetAvatar
            size={80}
            isEditable
            onChange={(value) => form.setValue("profileImage", value)}
          />
        </View>
        <Input name="name" placeholder="Name" autoCapitalize="none" />
        <DropdownInput
          name="petTypesId"
          placeholder="Select Pet Type"
          options={petTypeOptions}
        />
        <Input name="breed" placeholder="Breed" />
        <Input name="age" placeholder="Age" keyboardType="number-pad" />
        <DropdownInput
          name="gender"
          placeholder="Select Gender"
          options={genderOptions}
        />
        <DropdownInput
          name="petWeightsId"
          placeholder="Select Weight"
          options={weightOptions}
        />
        <DropdownInput
          name="spayedOrNeutered"
          placeholder="Select spayer or neutered"
          options={spayedOrNeuteredOptions}
        />
        <Input
          name="careGiverNotes"
          placeholder="Special Instructions / Notes"
        />
        <PetVaccinationsForm
          value={petVaccinations}
          onChange={(petVaccinations) =>
            form.setValue("petVaccinations", petVaccinations)
          }
        />
        <Button
          title="Add"
          onPress={form.handleSubmit(addPet)}
          loading={isAddingPet}
          color="secondary"
        />
      </View>
    </FormProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    width: "100%",
    gap: 16,
    backgroundColor: primaryColor,
  },
});
