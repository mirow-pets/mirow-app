import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { ScrollView } from "react-native-gesture-handler";

import {
  backgroundVerificationSchema,
  TBackgroundVerification,
} from "@/features/profile/validations";
import { useCaregiverCaregiver } from "@/hooks/caregiver/use-caregiver-caregiver";
import { useCaregiverPayment } from "@/hooks/caregiver/use-caregiver-payment";
import { useCaregiverProfile } from "@/hooks/caregiver/use-caregiver-profile";
import { useExitFormRouteWarning } from "@/hooks/use-exit-form-route";
import { useThemeColor } from "@/hooks/use-theme-color";

import { BackgroungVerificationStepFour } from "./background-verification/BackgroundVerificationStepFour";
import { BackgroungVerificationStepOne } from "./background-verification/BackgroundVerificationStepOne";
import { BackgroungVerificationStepThree } from "./background-verification/BackgroundVerificationStepThree";
import { BackgroungVerificationStepTwo } from "./background-verification/BackgroundVerificationStepTwo";

export default function BackgroundVerificationForm() {
  const [step, setStep] = useState(1);
  const primaryColor = useThemeColor({}, "primary");
  const {
    settings,
    initiateBackgroundVerification,
    createCheckrCandidate,
    isCreatingCheckrCandidate,
    isInitiatingBackgroundVerification,
  } = useCaregiverCaregiver();
  const {
    profile: {
      users: { firstName, lastName, email, phone, address },
      ssn,
      accHolderName,
      accountNumber,
      routingNumber,
      driverLicenseState,
      drivingLicense,
      day,
      month,
      year,
      customerId,
    },
  } = useCaregiverProfile();
  const {
    backgroundCheckInitialPayment,
    isLoadingBackgroundCheckInitialPayment,
  } = useCaregiverPayment();

  const backgroundCheckFee = Number(settings["background-check-fee"]);
  const convenienceFee = Number(settings["convenience-fee"]);

  const form = useForm({
    resolver: zodResolver(backgroundVerificationSchema),
    defaultValues: {
      ssn,
      accHolderName,
      accountNumber,
      routingNumber,
      driverLicenseState,
      drivingLicense,
      dateOfBirth: new Date(year, month - 1, day),
      customerId,
    },
  });

  // Keep this for documentUrl validation
  const values = form.watch();

  useExitFormRouteWarning({
    isDirty: form.formState.isDirty,
    onExit: () => {
      form.reset();
    },
  });

  const submit = async (input: TBackgroundVerification) => {
    const firstAddress = address[0];
    initiateBackgroundVerification(
      {
        ...values,
        country: values.country ?? "US",
      },
      () => {
        createCheckrCandidate({
          ...input,
          firstName,
          lastName,
          email,
          // TODO: Replace with actual number
          phone,
          address: firstAddress.address,
          city: firstAddress.city,
          state: firstAddress.state,
          postalCode: firstAddress.postalCode,
        });
      }
    );
  };

  const handleNext = (fields: string[]) => async () => {
    const result = await form.trigger(
      fields as unknown as keyof TBackgroundVerification
    );
    if (result) setStep((step) => (step === 2 && customerId ? 4 : step + 1));
  };

  const handlePrev = () =>
    setStep((step) => (step === 4 && customerId ? 2 : step - 1));

  const handlePayment = () => {
    backgroundCheckInitialPayment(
      {
        amount: +((backgroundCheckFee + convenienceFee) * 100).toFixed(),
        email,
        name: `${firstName} ${lastName}`,
        phone,
      },
      (initialPay) => {
        form.setValue("customerId", initialPay.customerId);
        initiateBackgroundVerification(
          {
            ...values,
            country: values.country ?? "US",
            customerId: initialPay.customerId,
          },
          () => setStep(4)
        );
      }
    );
  };

  return (
    <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="handled">
      <FormProvider {...form}>
        <View
          style={[
            styles.container,
            {
              backgroundColor: primaryColor,
            },
          ]}
        >
          {step === 1 && (
            <BackgroungVerificationStepOne
              onNext={handleNext([
                // "documentTypes",
                // "documentUrl",
                "drivingLicense",
                "driverLicenseState",
              ])}
            />
          )}
          {step === 2 && (
            <BackgroungVerificationStepTwo
              onNext={handleNext([
                "accHolderName",
                "accNum",
                "routingNumber",
                "ssn",
                "dateOfBirth",
              ])}
              onPrev={handlePrev}
            />
          )}
          {step === 3 && (
            <BackgroungVerificationStepThree
              backgroundCheckFee={backgroundCheckFee}
              convenienceFee={convenienceFee}
              onNext={handlePayment}
              onPrev={handlePrev}
              loading={isLoadingBackgroundCheckInitialPayment}
            />
          )}
          {step === 4 && (
            <BackgroungVerificationStepFour
              loading={
                isCreatingCheckrCandidate || isInitiatingBackgroundVerification
              }
              onNext={form.handleSubmit(submit)}
              onPrev={handlePrev}
            />
          )}
        </View>
      </FormProvider>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    padding: 20,
    width: "100%",
    gap: 16,
  },
});
