import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import { Button } from "@/components/button/Button";
import { Input } from "@/components/form/Input";
import { ThemedText } from "@/components/themed-text";
import { sendOtpSchema, TSendOtp } from "@/features/auth/validations";
import { useAuth } from "@/hooks/use-auth";
import { useExitFormRouteWarning } from "@/hooks/use-exit-form-route";
import { useOtp } from "@/hooks/use-otp";
import { TAuthUser, UserRole } from "@/types/users";

export interface SubmitOtpStepProps {
  user: TAuthUser;
  type: "2fa" | "email-update" | "password-update";
  next: () => void;
}

export const SubmitOtpStep = ({ user, type, next }: SubmitOtpStepProps) => {
  const { sendOtp, isSendingOtp } = useOtp();
  const { userRole } = useAuth();

  const form = useForm({
    resolver: zodResolver(sendOtpSchema),
    defaultValues: {
      email: user?.email!,
      role: (userRole === UserRole.PetOwner ? "petowner" : "caregiver") as
        | "petowner"
        | "caregiver",
      type,
    },
  });

  useExitFormRouteWarning({
    isDirty: form.formState.isDirty,
    onExit: () => {
      form.reset();
    },
  });

  const submit = (input: TSendOtp) => {
    sendOtp(input, { onSuccess: next });
  };

  return (
    <FormProvider {...form}>
      <ThemedText>
        We&apos;ll send you a one-time password (OTP) to help you reset your
        password.
      </ThemedText>
      <Input name="email" placeholder="Email" readOnly />
      <Button
        title="Continue"
        onPress={form.handleSubmit(submit)}
        loading={isSendingOtp}
        color="secondary"
      />
    </FormProvider>
  );
};
