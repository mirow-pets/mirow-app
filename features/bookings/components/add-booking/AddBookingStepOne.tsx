import { StyleSheet, View } from "react-native";

import { useFormContext } from "react-hook-form";
import { HelperText } from "react-native-paper";

import { Button } from "@/components/button/Button";
import { DateInput } from "@/components/form/DateInput";
import { TextInputField } from "@/components/form/TextInputField";
import { TimeInput } from "@/components/form/TimeInput";
import { PetAvatar } from "@/components/image/PetAvatar";
import { FormStepsLayout } from "@/components/layout/FormStepsLayout";
import { ThemedText } from "@/components/themed-text";
import { secondaryColor } from "@/constants/theme";
import { AddPetModal } from "@/features/bookings/components/AddPetModal";
import { TAddBooking } from "@/features/bookings/validations";
import { usePetOwnerPet } from "@/hooks/pet-owner/use-pet-owner-pet";
import { TPet } from "@/types";

export interface AddBookingStepOneProps {
  onPrev?: () => void;
  onNext: () => void;
}

export const AddBookingStepOne = ({
  onNext,
  onPrev,
}: AddBookingStepOneProps) => {
  const { pets, getPetType } = usePetOwnerPet();
  const form = useFormContext<TAddBooking>();

  const errors = form.formState.errors;
  const values = form.watch();
  const selectedPet = pets.find((pet) => pet.id === values.pets?.[0]);

  const handlePetAdded = (petId: TPet["id"]) => {
    form.setValue("pets", [petId], { shouldDirty: true });
    const pet = pets.find((pet) => pet.id === petId);
    if (!pet) return;
    form.setValue("petTypes", [pet.petTypesId], { shouldDirty: true });
  };

  const addPetModalTrigger = selectedPet ? (
    <View style={styles.selectedPetContainer}>
      <PetAvatar src={selectedPet.profileImage} size={40} />
      <View style={{ flex: 1 }}>
        <ThemedText style={{ fontWeight: "bold" }}>
          {selectedPet.name}
        </ThemedText>
        <ThemedText style={{ fontSize: 12 }}>
          {getPetType(selectedPet.petTypesId)?.display}
        </ThemedText>
      </View>
      <View>
        <ThemedText type="defaultSemiBold" style={styles.selectedPetChangeText}>
          Change
        </ThemedText>
      </View>
    </View>
  ) : (
    <Button color="secondary">Select pet</Button>
  );

  return (
    <FormStepsLayout {...{ onNext, onPrev, progress: 0 }}>
      <View>
        <AddPetModal trigger={addPetModalTrigger} onAdded={handlePetAdded} />
        <HelperText type="error">
          {errors?.pets?.message?.toString()}
        </HelperText>
      </View>
      <DateInput label="Service date" name="date" minimumDate={new Date()} />
      <TimeInput label="Service time" name="time" minimumDate={new Date()} />
      <TextInputField
        label="Special instructions / Notes (optional)"
        name="notes"
        numberOfLines={3}
        multiline
      />
    </FormStepsLayout>
  );
};

const styles = StyleSheet.create({
  selectedPetContainer: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  selectedPetChangeText: {
    color: secondaryColor,
  },
});
