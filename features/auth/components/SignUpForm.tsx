import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Href, useRouter } from "expo-router";
import { FormProvider, useForm } from "react-hook-form";
import Toast from "react-native-toast-message";

import { SignUpStepFour } from "@/features/auth/components/sign-up/SignUpStepFour";
import { SignUpStepOne } from "@/features/auth/components/sign-up/SignUpStepOne";
import { SignUpStepThree } from "@/features/auth/components/sign-up/SignUpStepThree";
import { SignUpStepTwo } from "@/features/auth/components/sign-up/SignUpStepTwo";
import { TSignUp, signUpSchema } from "@/features/auth/validations";
import { Post } from "@/services/http-service";
import { TUser } from "@/types";

export interface SignUpFormProps {
  path: string;
  redirect: Href;
}

export const SignUpForm = ({ path, redirect }: SignUpFormProps) => {
  const router = useRouter();
  const [step, setStep] = useState(1);

  const { mutate, isPending } = useMutation<
    TUser & { token: string },
    Error,
    TSignUp
  >({
    mutationFn: ({ confirmPassword, ...input }: TSignUp) => Post(path, input),
    onSuccess: async () => {
      router.replace(`${redirect}/login` as Href);
      Toast.show({
        type: "success",
        text1: "Sign up successfully!",
      });
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
            setStep(3);
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

  return (
    <FormProvider {...form}>
      <View style={styles.container}>
        {step === 1 && (
          <SignUpStepOne onNext={handleNext(["firstName", "lastName"])} />
        )}
        {step === 2 && (
          <SignUpStepTwo
            onNext={handleNext(["address", "city", "postalCode"])}
            onPrev={handlePrev}
          />
        )}
        {step === 3 && (
          <SignUpStepThree
            onNext={handleNext(["email", "phone"])}
            onPrev={handlePrev}
          />
        )}
        {step === 4 && (
          <SignUpStepFour
            onNext={form.handleSubmit(submit)}
            onPrev={handlePrev}
            loading={isPending}
          />
        )}
      </View>
    </FormProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 32,
  },
});
