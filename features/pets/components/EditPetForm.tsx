import React from "react";
import { StyleSheet, View } from "react-native";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import { Button } from "@/components/button/Button";
import { DropdownInput } from "@/components/form/DropdownInput";
import { TextInputField } from "@/components/form/TextInputField";
import { PetAvatar } from "@/components/image/PetAvatar";
import { editPetSchema, TEditPet } from "@/features/pets/validations";
import { usePetOwnerPet } from "@/hooks/pet-owner/use-pet-owner-pet";

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
          onPress={form.handleSubmit(editPet)}
          loading={isEditingPet}
          color="secondary"
        >
          Save
        </Button>
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
    gap: 16,
  },
});
