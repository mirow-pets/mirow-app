import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Href, useRouter } from "expo-router";
import { FormProvider, useForm } from "react-hook-form";
import Toast from "react-native-toast-message";

import { Modal } from "@/components/modal/Modal";
import { ThemedText } from "@/components/themed-text";
import { SignUpStepOne } from "@/features/auth/components/sign-up/SignUpStepOne";
import { SignUpStepThree } from "@/features/auth/components/sign-up/SignUpStepThree";
import { SignUpStepTwo } from "@/features/auth/components/sign-up/SignUpStepTwo";
import { SignUpStepZero } from "@/features/auth/components/sign-up/SignUpStepZero";
import { TSignUp, signUpSchema } from "@/features/auth/validations";
import { Post } from "@/services/http-service";
import { TUser } from "@/types";
import { formatDateToYMD } from "@/utils/date";

export interface SignUpFormProps {
  path: string;
  redirect: Href;
}

export const SignUpForm = ({ path, redirect }: SignUpFormProps) => {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [isSuccessful, setIsSuccessful] = useState(false);

  const { mutate, isPending } = useMutation<
    TUser & { token: string },
    Error,
    TSignUp
  >({
    mutationFn: ({ confirmPassword, ...input }: TSignUp) =>
      Post(path, {
        ...input,
        dateOfBirth: formatDateToYMD(input.dateOfBirth),
      }),
    onSuccess: async () => {
      setIsSuccessful(true);
    },
    onError: (err) => {
      let message = err.message;

      if ("statusCode" in err) {
        if (err.statusCode === 500)
          message = "An unexpected error occurred. Please try again.";
        if (err.statusCode === 401) message = "Invalid username or password";
        if (err.statusCode === 400) {
          const lowerCasedMessage = err.message.toLowerCase();
          if (lowerCasedMessage.includes("email")) {
            form.setError("email", { message: "Email is already in used" });
          } else if (lowerCasedMessage.includes("username")) {
            form.setError("username", {
              message: "Username is already in used",
            });
          }
        }
      }

      Toast.show({
        type: "error",
        text1: "Error",
        text2: message,
      });
    },
  });

  const form = useForm({
    resolver: zodResolver(signUpSchema),
  });

  const submit = (input: TSignUp) => {
    mutate(input);
  };

  const handleNext = (fields: string[]) => async () => {
    const result = await form.trigger(fields as unknown as keyof TSignUp);
    if (result) setStep((step) => step + 1);
  };

  const handlePrev = () => setStep((step) => step - 1);

  const handleContinue = () => {
    setIsSuccessful(false);
    router.replace(`${redirect}/login` as Href);
  };

  return (
    <FormProvider {...form}>
      <View style={styles.container}>
        {step === 0 && (
          <SignUpStepZero
            onPrev={router.back}
            onNext={() => setStep((step) => step + 1)}
          />
        )}
        {step === 1 && (
          <SignUpStepOne
            onNext={handleNext([
              "firstName",
              "lastName",
              "gender",
              "dateOfBirth",
            ])}
            onPrev={handlePrev}
          />
        )}
        {step === 2 && (
          <SignUpStepTwo
            onNext={handleNext(["phone", "address", "city", "postalCode"])}
            onPrev={handlePrev}
          />
        )}
        {step === 3 && (
          <SignUpStepThree
            onNext={form.handleSubmit(submit)}
            onPrev={handlePrev}
            loading={isPending}
          />
        )}
      </View>
      <Modal
        id="sign-up-success-modal"
        open={isSuccessful}
        confirmText="Continue"
        onConfirm={handleContinue}
        hideCancel
      >
        <View style={{ alignItems: "center", gap: 16, paddingTop: 16 }}>
          <Ionicons name="happy-outline" size={24} color="black" />
          <ThemedText style={{ textAlign: "center", fontSize: 20 }}>
            Sign Up Successful!
          </ThemedText>
          <ThemedText>Your account has been created!</ThemedText>
        </View>
      </Modal>
    </FormProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 32,
    flex: 1,
  },
});
