import { View } from "react-native";

import { useFormContext } from "react-hook-form";
import { HelperText } from "react-native-paper";

import { FormStepsLayout } from "@/components/layout/FormStepsLayout";
import { TAddBooking } from "@/features/bookings/validations";
import { PetsList } from "@/features/pets/components/PetsList";
import { useAddBooking } from "@/hooks/use-add-booking-form";
import { TPet } from "@/types";

export interface AddBookingSelectPetProps {
  progress: number;
}

export const AddBookingSelectPet = ({ progress }: AddBookingSelectPetProps) => {
  const { prev, next } = useAddBooking();
  const form = useFormContext<TAddBooking>();

  const errors = form.formState.errors;
  const values = form.watch();

  const handleSelect = (pet: TPet) => {
    form.setValue("petId", pet.id, { shouldDirty: true, shouldValidate: true });
    form.setValue("petTypeId", pet.petTypesId, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return (
    <FormStepsLayout {...{ onNext: next(["petId"]), onPrev: prev, progress }}>
      <View style={{ flex: 1 }}>
        <PetsList
          selectedIds={values.petId ? [values.petId] : []}
          onSelect={handleSelect}
        />
      </View>
      <HelperText type="error">{errors?.petId?.message?.toString()}</HelperText>
    </FormStepsLayout>
  );
};
