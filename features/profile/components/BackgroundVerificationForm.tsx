import React, { useState } from "react";
import { Platform, StyleSheet, View } from "react-native";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { FormProvider, useForm } from "react-hook-form";
import Toast from "react-native-toast-message";

import {
  TUpdateCaregiverProfile,
  updateCaregiverProfileSchema,
} from "@/features/profile/validations";
import { useCaregiverCaregiver } from "@/hooks/caregiver/use-caregiver-caregiver";
import { useCaregiverPayBackgroundCheck } from "@/hooks/caregiver/use-caregiver-pay-background-check/use-caregiver-pay-background-check";
import { useCaregiverProfile } from "@/hooks/caregiver/use-caregiver-profile";
import { useExitFormRouteWarning } from "@/hooks/use-exit-form-route";
import { addQueryParams, Get } from "@/services/http-service";
import { TInitialPay } from "@/types/payments";

import { BackgroungVerificationStepFour } from "./background-verification/BackgroundVerificationStepFour";
import { BackgroungVerificationStepOne } from "./background-verification/BackgroundVerificationStepOne";
import { BackgroungVerificationStepThree } from "./background-verification/BackgroundVerificationStepThree";
import { BackgroungVerificationStepTwo } from "./background-verification/BackgroundVerificationStepTwo";
import { BackgroundCheckPaymentModal } from "./BackgroundCheckPaymentModal";

export default function BackgroundVerificationForm() {
  const [step, setStep] = useState(1);
  const [promoCode, setPromocode] = useState<string>();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const queryClient = useQueryClient();

  const {
    settings,
    startBackgroundVerification,
    isStartingBackgroundVerification,
  } = useCaregiverCaregiver();
  const { profile, updateProfile, isUpdatingProfile } = useCaregiverProfile();
  const { payBackgroundCheck, isPayingBackgroundCheck } =
    useCaregiverPayBackgroundCheck();

  const convenienceFee = Number(settings["convenience-fee"]);

  const { data: backgroundCheckFee } = useQuery({
    queryKey: ["background-check-fee", promoCode],
    queryFn: () =>
      Get(addQueryParams("/v2/background-verifications/fee", { promoCode })),
  });

  const form = useForm({
    resolver: zodResolver(updateCaregiverProfileSchema),
    defaultValues: {
      ssn: profile.ssn,
      driverLicenseState: profile.driverLicenseState,
      drivingLicense: profile.drivingLicense,
      dateOfBirth: profile.users.dateOfBirth
        ? new Date(profile.users.dateOfBirth.toString().substring(0, 10))
        : undefined,
      customerId: profile.customerId,
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

  const submit = () => {
    startBackgroundVerification(
      {},
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries({
            queryKey: ["caregiver-profile"],
          });
          await queryClient.invalidateQueries({
            queryKey: ["caregiver-profile-completion"],
          });

          form.reset();
          router.replace("/caregiver/account");

          Toast.show({
            type: "success",
            text1: "Background check started successfully!",
          });
        },
      }
    );
  };

  const handleNext = (fields: string[]) => async () => {
    const result = await form.trigger(
      fields as unknown as keyof TUpdateCaregiverProfile
    );
    if (!result) return;

    setStep((step) =>
      step === 2 && profile.isBackgroundVerificationPaid ? 4 : step + 1
    );

    updateProfile(form.getValues());
  };

  const handlePrev = () =>
    setStep((step) =>
      step === 4 && profile.isBackgroundVerificationPaid ? 2 : step - 1
    );

  const runPaymentSuccess = (initialPay?: TInitialPay) => {
    form.setValue("customerId", initialPay?.customerId);
    updateProfile(
      {
        ...values,
        customerId: initialPay?.customerId,
      },
      { onSuccess: () => setStep(4) }
    );
  };
  console.log("showPaymentModal", showPaymentModal);
  const handlePayment = () => {
    console.log("handlePayment");
    if (Platform.OS === "web") {
      setShowPaymentModal(true);
      return;
    }
    payBackgroundCheck(
      { promoCode },
      {
        onSuccess: runPaymentSuccess,
        onError: (error) => {
          Toast.show({
            type: "error",
            text1: "Payment failed",
            text2: error?.message ?? "Please try again.",
          });
        },
      }
    );
  };

  const handleModalPay = () => {
    payBackgroundCheck(
      { promoCode },
      {
        onSuccess: (initialPay?: TInitialPay) => {
          setShowPaymentModal(false);
          runPaymentSuccess(initialPay);
        },
        onError: (error) => {
          Toast.show({
            type: "error",
            text1: "Payment failed",
            text2: error?.message ?? "Please try again.",
          });
        },
      }
    );
  };

  return (
    <FormProvider {...form}>
      <View style={styles.container}>
        {step === 1 && (
          <BackgroungVerificationStepOne
            onPrev={router.back}
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
            onNext={handleNext(["ssn", "dateOfBirth"])}
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
            loading={isPayingBackgroundCheck}
            onPromocodeChange={setPromocode}
          />
        )}
        {step === 4 && (
          <BackgroungVerificationStepFour
            loading={isStartingBackgroundVerification || isUpdatingProfile}
            onNext={submit}
            onPrev={handlePrev}
          />
        )}
      </View>
      {Platform.OS === "web" && (
        <BackgroundCheckPaymentModal
          open={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onPay={handleModalPay}
          loading={isPayingBackgroundCheck}
        />
      )}
    </FormProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    padding: 20,
    gap: 16,
  },
});
