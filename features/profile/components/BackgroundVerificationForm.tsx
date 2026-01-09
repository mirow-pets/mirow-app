import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { FormProvider, useForm } from "react-hook-form";
import { ScrollView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";

import {
  backgroundVerificationSchema,
  TBackgroundVerification,
} from "@/features/profile/validations";
import { useCaregiverCaregiver } from "@/hooks/caregiver/use-caregiver-caregiver";
import { useCaregiverPayment } from "@/hooks/caregiver/use-caregiver-payment";
import { useCaregiverProfile } from "@/hooks/caregiver/use-caregiver-profile";
import { useExitFormRouteWarning } from "@/hooks/use-exit-form-route";
import { useThemeColor } from "@/hooks/use-theme-color";
import { addQueryParams, Get } from "@/services/http-service";
import { TInitialPay } from "@/types/payments";

import { BackgroungVerificationStepFour } from "./background-verification/BackgroundVerificationStepFour";
import { BackgroungVerificationStepOne } from "./background-verification/BackgroundVerificationStepOne";
import { BackgroungVerificationStepThree } from "./background-verification/BackgroundVerificationStepThree";
import { BackgroungVerificationStepTwo } from "./background-verification/BackgroundVerificationStepTwo";

export default function BackgroundVerificationForm() {
  const [step, setStep] = useState(1);
  const [promoCode, setPromocode] = useState<string>();
  const primaryColor = useThemeColor({}, "primary");
  const queryClient = useQueryClient();

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
      isBackgroundVerificationPaid,
    },
  } = useCaregiverProfile();
  const {
    backgroundCheckInitialPayment,
    isLoadingBackgroundCheckInitialPayment,
  } = useCaregiverPayment();

  const convenienceFee = Number(settings["convenience-fee"]);

  const { data: backgroundCheckFee } = useQuery({
    queryKey: ["background-check-fee", promoCode],
    queryFn: () =>
      Get(addQueryParams("/v2/background-verifications/fee", { promoCode })),
  });

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
        createCheckrCandidate(
          {
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
          },
          {
            onSuccess: async () => {
              await queryClient.invalidateQueries({
                queryKey: ["caregiver-profile"],
              });
              await queryClient.invalidateQueries({
                queryKey: ["caregiver-profile-completion"],
              });

              form.reset();
              router.replace("/caregiver/profile");

              Toast.show({
                type: "success",
                text1: "Background check started successfully!",
              });
            },
          }
        );
      }
    );
  };

  const handleNext = (fields: string[]) => async () => {
    const result = await form.trigger(
      fields as unknown as keyof TBackgroundVerification
    );
    if (result)
      setStep((step) =>
        step === 2 && isBackgroundVerificationPaid ? 4 : step + 1
      );
  };

  const handlePrev = () =>
    setStep((step) =>
      step === 4 && isBackgroundVerificationPaid ? 2 : step - 1
    );

  const handlePayment = () => {
    const amount = +(backgroundCheckFee + convenienceFee * 100).toFixed();

    backgroundCheckInitialPayment(
      {
        amount,
        email,
        name: `${firstName} ${lastName}`,
        phone,
        promoCode,
      },
      (initialPay?: TInitialPay) => {
        if (initialPay) {
          form.setValue("customerId", initialPay.customerId);
          initiateBackgroundVerification(
            {
              ...values,
              country: values.country ?? "US",
              customerId: initialPay.customerId,
            },
            () => setStep(4)
          );
        } else {
          initiateBackgroundVerification(
            {
              ...values,
              country: values.country ?? "US",
            },
            () => setStep(4)
          );
        }
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
              promoCode={promoCode}
              backgroundCheckFee={backgroundCheckFee}
              convenienceFee={convenienceFee}
              onNext={handlePayment}
              onPrev={handlePrev}
              loading={isLoadingBackgroundCheckInitialPayment}
              onPromocodeChange={setPromocode}
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
