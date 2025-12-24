import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { FormProvider, useForm } from "react-hook-form";
import Toast from "react-native-toast-message";

import { Button } from "@/components/button/Button";
import { Input } from "@/components/form/Input";
import { SubmitOtpStep } from "@/features/auth/components/settings/SubmitOtpStep";
import { VerifyOtpStep } from "@/features/auth/components/settings/VerifyOtpStep";
import { changeEmailSchema, TChangeEmail } from "@/features/auth/validations";
import { useAuth } from "@/hooks/use-auth";
import { useExitFormRouteWarning } from "@/hooks/use-exit-form-route";
import OtpProvider, { useOtp } from "@/hooks/use-otp";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Patch } from "@/services/http-service";
import { TAuthUser, UserRole } from "@/types/users";
import { onError } from "@/utils";

export interface ChangeEmailStepProps {
  user: TAuthUser;
}

const ChangeEmailStep = ({ user }: ChangeEmailStepProps) => {
  const { otp } = useOtp();
  const { currUser, userRole } = useAuth();
  const queryClient = useQueryClient();

  const { mutate: changeEmail, isPending: isChangingEmail } = useMutation({
    mutationFn: (input: TChangeEmail) => Patch(`/v2/auth/change-email`, input),
    onError,
  });

  const form = useForm({
    resolver: zodResolver(changeEmailSchema),
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

  const submit = (input: TChangeEmail) => {
    changeEmail(input, {
      onSuccess: async () => {
        const queryKeys = [
          ["pet-owner-profile", currUser?.sessionId],
          ["caregiver-profile", currUser?.sessionId],
        ];
        await Promise.all(
          queryKeys.map((queryKey) =>
            queryClient.invalidateQueries({
              queryKey,
            })
          )
        );

        Toast.show({
          type: "success",
          text1: "Email changed successfully!",
        });
        form.reset();
        router.replace(`/${userRole as UserRole}/settings`);
      },
    });
  };

  return (
    <FormProvider {...form}>
      <Input name="newEmail" label="New email" />
      <Button
        title="Change email"
        onPress={form.handleSubmit(submit)}
        loading={isChangingEmail}
        color="secondary"
      />
    </FormProvider>
  );
};

export interface ChangeEmailFormProps {
  user: TAuthUser;
}

export default function ChangeEmailForm({ user }: ChangeEmailFormProps) {
  const primaryColor = useThemeColor({}, "primary");
  const [step, setStep] = useState(1);

  const handleNext = () => setStep((step) => step + 1);

  return (
    <OtpProvider>
      <View style={[styles.container, { backgroundColor: primaryColor }]}>
        {step === 1 && (
          <SubmitOtpStep user={user} type="email-update" next={handleNext} />
        )}
        {step === 2 && (
          <VerifyOtpStep user={user} type="email-update" next={handleNext} />
        )}
        {step === 3 && <ChangeEmailStep user={user} />}
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
