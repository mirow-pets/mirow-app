import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { FormProvider, useForm } from "react-hook-form";
import Toast from "react-native-toast-message";

import { Button } from "@/components/button/Button";
import { PasswordInput } from "@/components/form/PasswordInput";
import { SubmitOtpStep } from "@/features/auth/components/settings/SubmitOtpStep";
import { VerifyOtpStep } from "@/features/auth/components/settings/VerifyOtpStep";
import {
  changePasswordSchema,
  TChangePassword,
} from "@/features/auth/validations";
import { useAuth } from "@/hooks/use-auth";
import { useExitFormRouteWarning } from "@/hooks/use-exit-form-route";
import OtpProvider, { useOtp } from "@/hooks/use-otp";
import { Patch } from "@/services/http-service";
import { TAuthUser, UserRole } from "@/types/users";
import { onError } from "@/utils";

export interface ChangePasswordStepProps {
  user: TAuthUser;
}

const ChangePasswordStep = ({ user }: ChangePasswordStepProps) => {
  const { otp } = useOtp();
  const { userRole } = useAuth();

  const { mutate: changePassword, isPending: isChangingPassword } = useMutation(
    {
      mutationFn: ({ confirmPassword, ...input }: TChangePassword) =>
        Patch(`/v2/auth/change-password`, input),
      onError,
    },
  );

  const form = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      email: user?.email!,
      otp,
    },
  });

  useExitFormRouteWarning({
    isDirty: form.formState.isDirty,
    onExit: () => {
      form.reset();
    },
  });

  const submit = (input: TChangePassword) => {
    changePassword(input, {
      onSuccess: () => {
        Toast.show({
          type: "success",
          text1: "Password changed successfully!",
        });
        form.reset();
        router.replace(`/${userRole as UserRole}/settings`);
      },
    });
  };

  return (
    <FormProvider {...form}>
      <PasswordInput name="oldPassword" label="Old password" />
      <PasswordInput name="newPassword" label="New password" />
      <PasswordInput name="confirmPassword" label="Confirm password" />
      <Button
        onPress={form.handleSubmit(submit)}
        loading={isChangingPassword}
        color="secondary"
      >
        Change password
      </Button>
    </FormProvider>
  );
};

export interface ChangePasswordFormProps {
  user: TAuthUser;
}

export default function ChangePasswordForm({ user }: ChangePasswordFormProps) {
  const [step, setStep] = useState(1);

  const handleNext = () => setStep((step) => step + 1);

  return (
    <OtpProvider>
      <View style={styles.container}>
        {step === 1 && (
          <SubmitOtpStep
            description="We'll send you a one-time password (OTP) to help you change your password."
            email={user?.email}
            type="password-update"
            next={handleNext}
          />
        )}
        {step === 2 && (
          <VerifyOtpStep
            email={user?.email}
            type="password-update"
            next={handleNext}
          />
        )}
        {step === 3 && <ChangePasswordStep user={user} />}
      </View>
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
