import { StyleSheet, View } from "react-native";

import dayjs from "dayjs";
import { useFormContext } from "react-hook-form";

import { FormStepsLayout } from "@/components/layout/FormStepsLayout";
import { ThemedText } from "@/components/themed-text";
import { TAddBooking } from "@/features/bookings/validations";
import { usePetOwnerPet } from "@/hooks/pet-owner/use-pet-owner-pet";
import { useAddBooking } from "@/hooks/use-add-booking-form";

export interface AddBookingConfirmationProps {
  serviceType: string;
}

export const AddBookingConfirmation = ({
  serviceType,
}: AddBookingConfirmationProps) => {
  const { addBooking, prev, isAddingBooking } = useAddBooking();
  const form = useFormContext<TAddBooking>();
  const values = form.watch();
  const { pets, getPetType } = usePetOwnerPet();

  const selectedPet = pets.find((pet) => pet.id === values.petId);
  const selectedPetType = selectedPet
    ? getPetType(selectedPet.petTypesId)
    : null;

  // Fallback formatting if fields missing
  const startDate = values.startDate
    ? dayjs(values.startDate).format("MMM D, YYYY")
    : "-";
  const startTime = values.startTime
    ? dayjs(values.startTime).format("h:mm A")
    : "-";

  // Notes may be optional
  const notes = values.notes || "-";

  const onNext = form.handleSubmit((input) => {
    addBooking(input);
  });

  return (
    <FormStepsLayout
      {...{ onNext, onPrev: prev, loading: isAddingBooking, progress: 100 }}
    >
      <ThemedText type="defaultSemiBold" style={styles.title}>
        Checkout
      </ThemedText>

      <View style={styles.section}>
        <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
          Pet
        </ThemedText>
        <ThemedText>
          {selectedPet ? selectedPet.name : "-"}
          {selectedPetType ? ` (${selectedPetType.display})` : ""}
        </ThemedText>
      </View>

      <View style={styles.section}>
        <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
          Service
        </ThemedText>
        <ThemedText>{serviceType}</ThemedText>
      </View>

      <View style={styles.section}>
        <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
          Date & Time
        </ThemedText>
        <ThemedText>
          {startDate} at {startTime}
        </ThemedText>
      </View>

      <View style={styles.section}>
        <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
          Notes
        </ThemedText>
        <ThemedText>{notes}</ThemedText>
      </View>
    </FormStepsLayout>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    marginBottom: 18,
    textAlign: "center",
  },
  section: {
    marginVertical: 8,
    paddingBottom: 4,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 2,
  },
});
