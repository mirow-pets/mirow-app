import React, { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { FormProvider, useForm } from "react-hook-form";

import { Button } from "@/components/button/Button";
import { OtpInput } from "@/components/form/OtpInput";
import { ThemedText } from "@/components/themed-text";
import { Timer } from "@/components/Timer";
import { TVerifyOtp, verifyOtpSchema } from "@/features/auth/validations";
import { useAuth } from "@/hooks/use-auth";
import { useExitFormRouteWarning } from "@/hooks/use-exit-form-route";
import { useOtp } from "@/hooks/use-otp";
import { Post } from "@/services/http-service";
import { TAuthUser, UserRole } from "@/types/users";
import { onError } from "@/utils";

export interface VerifyOtpStepProps {
  user: TAuthUser;
  type: "2fa" | "email-update" | "password-update";
  next: () => void;
}

export const VerifyOtpStep = ({ user, type, next }: VerifyOtpStepProps) => {
  const { setOtp, sendOtp, isSendingOtp } = useOtp();
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const { userRole } = useAuth();
  const [state, setState] = useState<"start" | "stop">("start");

  const { mutate: verifyOtp, isPending: isVerifyingOtp } = useMutation({
    mutationFn: (input: TVerifyOtp) => Post(`/v2/auth/verify-otp`, input),
    onError,
  });

  const form = useForm({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: {
      email: user?.email!,
    },
    mode: "onChange",
  });

  useExitFormRouteWarning({
    isDirty: form.formState.isDirty,
    onExit: () => {
      form.reset();
    },
  });

  const handleResendOtp = () => {
    sendOtp(
      {
        email: user?.email!,
        role: userRole === UserRole.PetOwner ? "petowner" : "caregiver",
        type,
      },
      {
        onSuccess: () => {
          setIsResendDisabled(true);
          setState("start");
        },
      }
    );
  };

  const submit = (input: TVerifyOtp) => {
    verifyOtp(input, {
      onSuccess: () => {
        setState("stop");
        setOtp(input.otp);
        next();
      },
    });
  };

  return (
    <FormProvider {...form}>
      <View style={styles.container}>
        <ThemedText style={styles.instructions}>
          Please enter the OTP sent to
        </ThemedText>
        <ThemedText type="subtitle" style={styles.email}>
          {user?.email}
        </ThemedText>
        <Timer
          state={state}
          onCountingEnded={() => {
            setIsResendDisabled(false);
            setState("stop");
          }}
        />
        <View style={styles.otpInputContainer}>
          <OtpInput name="otp" />
        </View>
        <Button
          disabled={!form.formState.isValid || isVerifyingOtp}
          title={isVerifyingOtp ? "Verifying..." : "Verify"}
          onPress={form.handleSubmit(submit)}
          loading={isVerifyingOtp}
          color="secondary"
          style={styles.button}
        />
        <View style={styles.resendContainer}>
          <ThemedText style={styles.resendText}>
            Didn&apos;t receive the OTP?{" "}
          </ThemedText>
          <TouchableOpacity
            disabled={isResendDisabled || isSendingOtp}
            onPress={handleResendOtp}
            style={[
              styles.resendButton,
              (isResendDisabled || isSendingOtp) && styles.disabledResendButton,
            ]}
          >
            {isSendingOtp ? (
              <ActivityIndicator size="small" color="#888" />
            ) : (
              <ThemedText style={styles.resendButtonText}>
                Resend OTP
              </ThemedText>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </FormProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 18,
    width: "100%",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 10,
  },
  instructions: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 0,
  },
  email: {
    fontSize: 16,
    fontWeight: "600",
    color: "#458BDE",
    textAlign: "center",
    letterSpacing: 0.2,
    marginBottom: 0,
  },
  otpInputContainer: {
    width: "70%",
    alignItems: "center",
    marginVertical: 4,
  },
  button: {
    marginTop: 12,
    width: "90%",
    alignSelf: "center",
  },
  resendContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  resendText: {
    fontSize: 14,
    color: "#444",
  },
  resendButton: {
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  resendButtonText: {
    fontWeight: "600",
    fontSize: 14,
  },
  disabledResendButton: {
    opacity: 0.5,
  },
});
