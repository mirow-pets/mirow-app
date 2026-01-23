import React from "react";
import { View } from "react-native";

import { PasswordInput } from "@/components/form/PasswordInput";
import { TextInputField } from "@/components/form/TextInputField";
import { ThemedText } from "@/components/themed-text";

import { FormStepsLayout } from "../../../../components/layout/FormStepsLayout";

export interface SignUpStepThreeProps {
  onPrev?: () => void;
  onNext: () => void;
  loading?: boolean;
}

export const SignUpStepThree = ({
  onNext,
  onPrev,
  loading,
}: SignUpStepThreeProps) => {
  return (
    <FormStepsLayout {...{ onNext, onPrev, loading, progress: 0.6 }}>
      <View style={{ marginBottom: 32 }}>
        <ThemedText type="subtitle" style={{ fontSize: 24 }}>
          Just a few quick steps
        </ThemedText>
        <ThemedText>
          We can&apos;t wait to help you and your pet enjoy everything Mirow has
          to offer across the Sunshine State.
        </ThemedText>
      </View>
      <TextInputField
        label="Email"
        name="email"
        placeholder="Email"
        autoCapitalize="none"
        mode="flat"
      />
      <TextInputField
        label="Username"
        name="username"
        placeholder="Username"
        mode="flat"
      />
      <PasswordInput
        label="Password"
        name="password"
        placeholder="Password"
        mode="flat"
      />
      <PasswordInput
        label="Confirm password"
        name="confirmPassword"
        placeholder="Confirm Password"
        mode="flat"
      />
    </FormStepsLayout>
  );
};
