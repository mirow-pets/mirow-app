import { StyleSheet, View } from "react-native";

import { useFormContext } from "react-hook-form";

import { DateTimeInput } from "@/components/form/DateTimeInput";
import { Input } from "@/components/form/Input";
import { PetAvatar } from "@/components/image/PetAvatar";
import { FormStepsLayout } from "@/components/layout/FormStepsLayout";
import { ThemedText } from "@/components/themed-text";
import { primaryColor, secondaryColor, whiteColor } from "@/constants/theme";
import { AddPetModal } from "@/features/bookings/components/AddPetModal";
import { TAddBooking } from "@/features/bookings/validations";
import { usePet } from "@/hooks/use-pet";
import { TPet } from "@/types";

export interface AddBookingStepOneProps {
  onPrev?: () => void;
  onNext: () => void;
}

export const AddBookingStepOne = ({
  onNext,
  onPrev,
}: AddBookingStepOneProps) => {
  const { pets, getPetType } = usePet();
  const form = useFormContext<TAddBooking>();

  const errors = form.formState.errors;
  const values = form.watch();
  const selectedPet = pets.find((pet) => pet.id === values.pets?.[0]);

  const handlePetAdded = (petId: TPet["id"]) => {
    form.setValue("pets", [petId]);
    const pet = pets.find((pet) => pet.id === petId);
    if (!pet) return;
    form.setValue("petTypes", [pet.petTypesId]);
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
    <View style={styles.selectPetContainer}>
      <ThemedText type="defaultSemiBold" style={styles.selectPetText}>
        Select pet
      </ThemedText>
    </View>
  );

  return (
    <FormStepsLayout {...{ onNext, onPrev }}>
      <View>
        <AddPetModal trigger={addPetModalTrigger} onAdded={handlePetAdded} />
        <ThemedText type="error">
          {errors?.pets?.message?.toString()}
        </ThemedText>
      </View>
      <DateTimeInput
        label="Service date"
        name="startDate"
        minimumDate={new Date()}
      />
      <Input label="Special instructions / Notes" name="notes" />
    </FormStepsLayout>
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
  selectPetContainer: {
    padding: 8,
    backgroundColor: secondaryColor,
    borderRadius: 32,
  },
  selectPetText: {
    textAlign: "center",
    color: whiteColor,
  },
  selectedPetContainer: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  selectedPetChangeText: {
    color: secondaryColor,
  },
});
