import { StyleSheet, View } from "react-native";

import { useRouter } from "expo-router";
import { useFormContext } from "react-hook-form";
import { HelperText } from "react-native-paper";

import { FormStepsLayout } from "@/components/layout/FormStepsLayout";
import { ThemedText } from "@/components/themed-text";
import { primaryColor, secondaryColor, whiteColor } from "@/constants/theme";
import { TAddBooking } from "@/features/bookings/validations";
import { CaregiversList } from "@/features/caregivers/components/CaregiversList";
import { usePetOwnerPet } from "@/hooks/pet-owner/use-pet-owner-pet";
import { useAddBooking } from "@/hooks/use-add-booking-form";
import { TServiceType, TUser } from "@/types";

export interface AddBookingSelectCaregiverProps {
  progress: number;
  serviceTypeId: TServiceType["id"];
}

export const AddBookingSelectCaregiver = ({
  progress,
  serviceTypeId,
}: AddBookingSelectCaregiverProps) => {
  const { handleCaregiverNext, prev } = useAddBooking();
  const router = useRouter();
  const { pets } = usePetOwnerPet();

  const form = useFormContext<TAddBooking>();

  const values = form.watch();
  const errors = form.formState.errors;

  const handleClick = (userId: TUser["id"]) => {
    router.push(`/pet-owner/caregivers/${userId}`);
  };

  const pet = pets.find((pet) => pet.id === values.petId);

  return (
    <FormStepsLayout
      {...{
        onNext: handleCaregiverNext(["caregiverId"]),
        onPrev: prev,
        progress,
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <ThemedText type="defaultSemiBold">Pick your caregiver</ThemedText>
      </View>

      <CaregiversList
        filterPetName={pet?.name}
        defaultFilter={{
          serviceTypeIds: [serviceTypeId],
          petTypeIds: [values.petTypeId],
        }}
        disabledFields={["serviceTypeIds", "petTypeIds"]}
        onClick={handleClick}
        onSelect={(userId) => form.setValue("caregiverId", userId)}
        selectedIds={values.caregiverId ? [values.caregiverId] : []}
      />
      <HelperText type="error">
        {errors?.caregiverId?.message?.toString()}
      </HelperText>
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
  optionContainer: {
    padding: 16,
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
    backgroundColor: whiteColor,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "transparent",
  },
  optionContainerActive: {
    borderColor: secondaryColor,
  },
});
