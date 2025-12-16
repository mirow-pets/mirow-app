import React from "react";
import { StyleSheet, View } from "react-native";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import { Button } from "@/components/button/Button";
import { DropdownInput } from "@/components/form/DropdownInput";
import { Input } from "@/components/form/Input";
import { PetAvatar } from "@/components/image/PetAvatar";
import { primaryColor } from "@/constants/theme";
import { editPetSchema, TEditPet } from "@/features/pets/validations";
import { usePetOwnerPet } from "@/hooks/pet-owner/use-pet-owner-pet";

import { PetVaccinationsForm } from "./PetVaccinationsForm";

export interface EditPetFormProps {
  defaultValues: TEditPet;
}

export const EditPetForm = ({ defaultValues }: EditPetFormProps) => {
  const {
    editPet,
    isEditingPet,
    petTypeOptions,
    genderOptions,
    weightOptions,
    spayedOrNeuteredOptions,
  } = usePetOwnerPet();

  const form = useForm({
    resolver: zodResolver(editPetSchema),
    defaultValues: {
      ...defaultValues,
      petVaccinations: defaultValues.petVaccinations ?? [],
    },
  });

  const profileImage = form.watch("profileImage");
  const petVaccinations = form.watch("petVaccinations");

  return (
    <FormProvider {...form}>
      <View style={styles.container}>
        <View style={{ alignItems: "center", padding: 16 }}>
          <PetAvatar
            size={80}
            isEditable
            onChange={(value) => form.setValue("profileImage", value)}
            src={profileImage || undefined}
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
          value={petVaccinations ?? []}
          onChange={(petVaccinations) =>
            form.setValue("petVaccinations", petVaccinations)
          }
        />
        <Button
          title="Edit"
          onPress={form.handleSubmit(editPet)}
          loading={isEditingPet}
          color="secondary"
        />
      </View>
    </FormProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 100,
    width: "100%",
    gap: 16,
    backgroundColor: primaryColor,
  },
});
