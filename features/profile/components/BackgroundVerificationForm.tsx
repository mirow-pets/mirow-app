import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import { primaryColor } from "@/constants/theme";
import {
  backgroundVerificationSchema,
  TBackgroundVerification,
} from "@/features/profile/validations/background-verification-schema";
import { useExitFormRouteWarning } from "@/hooks/use-exit-form-route";

import { BackgroungVerificationStepOne } from "./background-verification/BackgroundVerificationStepOne";
import { BackgroungVerificationStepTwo } from "./background-verification/BackgroundVerificationStepTwo";

export default function BackgroundVerificationForm() {
  const [step, setStep] = useState(1);

  const form = useForm({
    resolver: zodResolver(backgroundVerificationSchema),
  });

  useExitFormRouteWarning({
    isDirty: form.formState.isDirty,
    onExit: () => {
      form.reset();
    },
  });

  const submit = async (input: TBackgroundVerification) => {};

  const handleNext = (fields: string[]) => async () => {
    const result = await form.trigger(
      fields as unknown as keyof TBackgroundVerification
    );
    if (result) setStep((step) => step + 1);
  };

  const handlePrev = () => setStep((step) => step - 1);

  return (
    <FormProvider {...form}>
      <View style={styles.container}>
        {step === 1 && (
          <BackgroungVerificationStepOne
            onNext={handleNext(["accHolderName", "accNum", "routingNumber"])}
          />
        )}
        {step === 2 && (
          <BackgroungVerificationStepTwo
            onNext={handleNext(["accHolderName", "accNum", "routingNumber"])}
            onPrev={handlePrev}
          />
        )}
      </View>
    </FormProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    padding: 20,
    width: "100%",
    gap: 16,
    backgroundColor: primaryColor,
  },
});
