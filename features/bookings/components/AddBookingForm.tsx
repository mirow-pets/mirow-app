import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import { addBookingSchema, TAddBooking } from "@/features/bookings/validations";
import { usePetOwnerBooking } from "@/hooks/pet-owner/use-pet-owner-booking";
import { usePetOwnerCaregiverFilter } from "@/hooks/pet-owner/use-pet-owner-caregivers-filter";
import { useExitFormRouteWarning } from "@/hooks/use-exit-form-route";

import { AddBookingStepOne } from "./add-booking/AddBookingStepOne";
import { AddBookingStepThree } from "./add-booking/AddBookingStepThree";
import { AddBookingStepTwo } from "./add-booking/AddBookingStepTwo";

export const AddBookingForm = () => {
  const { isAddingBooking, addBooking } = usePetOwnerBooking();
  const { setFilter } = usePetOwnerCaregiverFilter();
  const [step, setStep] = useState(1);
  const currentDate = new Date();

  const startDate = new Date(
    currentDate.setMinutes(currentDate.getMinutes() + 30)
  );

  const form = useForm({
    resolver: zodResolver(addBookingSchema),
    defaultValues: {
      startDate,
      pets: [],
      petTypes: [],
      serviceTypesId: 6,
    },
  });

  const values = form.watch();

  const handleNext = (fields: string[]) => async () => {
    const result = await form.trigger(fields as unknown as keyof TAddBooking);
    if (result) setStep((step) => step + 1);
  };

  const handlePrev = () => setStep((step) => step - 1);

  const handleStepTwoNext = (fields: string[]) => async () => {
    const result = await form.trigger(fields as unknown as keyof TAddBooking);
    if (!result) return;
    if (!values.isOpenShift) {
      setFilter((v) => ({
        ...v,
        petTypeIds: values.petTypes,
        serviceTypeIds: [values.serviceTypesId],
      }));
      setStep((step) => step + 1);
    } else addBooking(values);
  };

  const { handleGoBack } = useExitFormRouteWarning({
    isDirty: form.formState.isDirty,
    onExit: () => {
      form.reset();
    },
  });

  return (
    <FormProvider {...form}>
      <View style={styles.container}>
        {step === 1 && (
          <AddBookingStepOne
            onPrev={handleGoBack}
            onNext={handleNext(["pets", "startDate", "notes"])}
          />
        )}
        {step === 2 && (
          <AddBookingStepTwo
            onNext={handleStepTwoNext(["isOpenShift"])}
            onPrev={handlePrev}
            loading={isAddingBooking}
          />
        )}
        {step === 3 && (
          <AddBookingStepThree
            onNext={form.handleSubmit(addBooking)}
            onPrev={handlePrev}
            loading={isAddingBooking}
          />
        )}
      </View>
      <View style={{ height: 100 }} />
    </FormProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 16,
  },
});
