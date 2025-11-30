import React from "react";

import { Input } from "@/components/form/Input";
import { PasswordInput } from "@/components/form/PasswordInput";

import { FormStepsLayout } from "../../../../components/layout/FormStepsLayout";

export interface SignUpStepFourProps {
  loading?: boolean;
  onPrev?: () => void;
  onNext: () => void;
}

export const SignUpStepFour = ({
  loading,
  onNext,
  onPrev,
}: SignUpStepFourProps) => {
  return (
    <FormStepsLayout {...{ loading, onNext, onPrev }}>
      <Input name="username" placeholder="Username" />
      <PasswordInput name="password" placeholder="Password" />
      <PasswordInput name="confirmPassword" placeholder="Confirm Password" />
    </FormStepsLayout>
  );
};
