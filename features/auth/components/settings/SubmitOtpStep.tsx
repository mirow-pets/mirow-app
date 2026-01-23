import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import { Button } from "@/components/button/Button";
import { TextInputField } from "@/components/form/TextInputField";
import { ThemedText } from "@/components/themed-text";
import { sendOtpSchema, TSendOtp } from "@/features/auth/validations";
import { useAuth } from "@/hooks/use-auth";
import { useExitFormRouteWarning } from "@/hooks/use-exit-form-route";
import { useOtp } from "@/hooks/use-otp";
import { TAuthUser, UserRole } from "@/types/users";

export interface SubmitOtpStepProps {
  email?: TAuthUser["email"];
  description?: string;
  type: "2fa" | "email-update" | "password-update";
  onEmailChange?: (_email: string) => void;
  next: () => void;
}

export const SubmitOtpStep = ({
  description,
  email,
  type,
  next,
  onEmailChange,
}: SubmitOtpStepProps) => {
  const { sendOtp, isSendingOtp } = useOtp();
  const { userRole } = useAuth();

  const form = useForm({
    resolver: zodResolver(sendOtpSchema),
    defaultValues: {
      email: email!,
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
      <ThemedText>{description}</ThemedText>
      <TextInputField
        label="Email"
        name="email"
        placeholder="Email"
        readOnly={!!email}
        onChangeText={onEmailChange}
        autoCapitalize="none"
      />
      <Button
        onPress={form.handleSubmit(submit)}
        loading={isSendingOtp}
        color="secondary"
      >
        Continue
      </Button>
    </FormProvider>
  );
};
