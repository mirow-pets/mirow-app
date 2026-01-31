import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { FormProvider, useForm } from "react-hook-form";
import Toast from "react-native-toast-message";

import { Button } from "@/components/button/Button";
import { PasswordInput } from "@/components/form/PasswordInput";
import AuthScreenLayout from "@/components/layout/AuthScreenLayout";
import { SubmitOtpStep } from "@/features/auth/components/settings/SubmitOtpStep";
import { VerifyOtpStep } from "@/features/auth/components/settings/VerifyOtpStep";
import {
  resetPasswordSchema,
  TResetPassword,
} from "@/features/auth/validations";
import { useAuth } from "@/hooks/use-auth";
import { useExitFormRouteWarning } from "@/hooks/use-exit-form-route";
import OtpProvider, { useOtp } from "@/hooks/use-otp";
import { Patch } from "@/services/http-service";
import { UserRole } from "@/types/users";
import { onError } from "@/utils";

interface ForgotPasswordStepProps {
  email?: string;
}

const ForgotPasswordStep = ({ email }: ForgotPasswordStepProps) => {
  const { otp } = useOtp();
  const { userRole } = useAuth();

  const { mutate: changePassword, isPending: isChangingPassword } = useMutation(
    {
      mutationFn: ({ confirmPassword, ...input }: TResetPassword) =>
        Patch(`/v2/auth/reset-password`, input),
      onError,
    }
  );

  const form = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email,
      otp,
      role: userRole === UserRole.PetOwner ? "petowner" : "caregiver",
    },
  });

  useExitFormRouteWarning({
    isDirty: form.formState.isDirty,
    onExit: () => {
      form.reset();
    },
  });

  const submit = (input: TResetPassword) => {
    changePassword(input, {
      onSuccess: () => {
        Toast.show({
          type: "success",
          text1: "Password changed successfully!",
        });
        form.reset();
        router.replace(`/${userRole as UserRole}/login`);
      },
    });
  };

  return (
    <FormProvider {...form}>
      <PasswordInput name="password" label="New password" mode="outlined" />
      <PasswordInput
        name="confirmPassword"
        label="Confirm password"
        mode="outlined"
      />
      <Button onPress={form.handleSubmit(submit)} loading={isChangingPassword}>
        Done!
      </Button>
    </FormProvider>
  );
};

export default function ForgotPasswordForm() {
  const { userRole } = useAuth();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState<string>();

  const handleNext = () => setStep((step) => step + 1);

  return (
    <OtpProvider>
      <AuthScreenLayout
        bgImage={
          userRole === UserRole.PetOwner
            ? require("@/assets/images/pet-owner-login-bg.png")
            : require("@/assets/images/caregiver-login-bg.png")
        }
      >
        <View style={styles.container}>
          {step === 1 && (
            <SubmitOtpStep
              description="We got you! Fill in your email and we will send a code to reset your password"
              type="password-update"
              next={handleNext}
              onEmailChange={setEmail}
            />
          )}
          {step === 2 && (
            <VerifyOtpStep
              email={email}
              type="password-update"
              next={handleNext}
            />
          )}
          {step === 3 && <ForgotPasswordStep email={email} />}
        </View>
      </AuthScreenLayout>
    </OtpProvider>
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
