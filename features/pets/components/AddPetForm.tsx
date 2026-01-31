import React from "react";
import { StyleSheet, View } from "react-native";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import { Button } from "@/components/button/Button";
import { DropdownInput } from "@/components/form/DropdownInput";
import { TextInputField } from "@/components/form/TextInputField";
import { PetAvatarEditable } from "@/components/image/PetAvatarEditable";
import { addPetSchema } from "@/features/pets/validations";
import { usePetOwnerPet } from "@/hooks/pet-owner/use-pet-owner-pet";

export const AddPetForm = () => {
  const {
    addPet,
    isAddingPet,
    petTypeOptions,
    genderOptions,
    weightOptions,
    spayedOrNeuteredOptions,
  } = usePetOwnerPet();

  const form = useForm({
    resolver: zodResolver(addPetSchema),
    defaultValues: {
      petVaccinations: [],
    },
  });

  return (
    <FormProvider {...form}>
      <View style={styles.container}>
        <View style={{ alignItems: "center", padding: 16 }}>
          <PetAvatarEditable
            size={80}
            onChange={(value) => form.setValue("profileImage", value)}
          />
        </View>
        <TextInputField
          label="Name"
          name="name"
          placeholder="Name"
          autoCapitalize="none"
        />
        <DropdownInput
          label="Pet type"
          name="petTypesId"
          placeholder="Select Pet Type"
          options={petTypeOptions}
        />
        <TextInputField label="Breed" name="breed" placeholder="Breed" />
        <TextInputField
          label="Age"
          name="age"
          placeholder="Age"
          keyboardType="number-pad"
        />
        <DropdownInput
          label="Gender"
          name="gender"
          placeholder="Select Gender"
          options={genderOptions}
        />
        <DropdownInput
          label="Pet weight"
          name="petWeightsId"
          placeholder="Select Weight"
          options={weightOptions}
        />
        <DropdownInput
          label="Spayed or neutered"
          name="spayedOrNeutered"
          placeholder="Select spayer or neutered"
          options={spayedOrNeuteredOptions}
        />
        <TextInputField
          label="Special Instructions / Notes"
          name="careGiverNotes"
          placeholder="Special Instructions / Notes"
          numberOfLines={3}
          multiline
        />
        {/* <PetVaccinationsForm
          value={petVaccinations}
          onChange={(petVaccinations) =>
            form.setValue("petVaccinations", petVaccinations)
          }
        /> */}
        <Button
          onPress={form.handleSubmit(addPet)}
          loading={isAddingPet}
          color="secondary"
        >
          Add
        </Button>
      </View>
    </FormProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    gap: 16,
  },
});
