import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import { primaryColor, secondaryColor, whiteColor } from "@/constants/theme";
import { addBookingSchema, TAddBooking } from "@/features/bookings/validations";
import { useBooking } from "@/hooks/use-booking";

import { AddBookingStepOne } from "./add-booking/AddBookingStepOne";
import { AddBookingStepThree } from "./add-booking/AddBookingStepThree";
import { AddBookingStepTwo } from "./add-booking/AddBookingStepTwo";

export const AddBookingForm = () => {
  const { isAddingBooking, addBooking } = useBooking();
  const [step, setStep] = useState(1);

  const form = useForm({
    resolver: zodResolver(addBookingSchema),
    defaultValues: {
      pets: [],
      petTypes: [],
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
    if (!values.isOpenShift) setStep((step) => step + 1);
    else addBooking(values);
  };

  return (
    <FormProvider {...form}>
      <View style={styles.container}>
        {step === 1 && (
          <AddBookingStepOne
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
        {/* {step === 4 && (
          <SignUpStepFour
            onNext={form.handleSubmit(submit)}
            onPrev={handlePrev}
            loading={isPending}
          />
        )} */}
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
