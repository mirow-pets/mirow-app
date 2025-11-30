import React from "react";

import { Input } from "@/components/form/Input";

import { FormStepsLayout } from "../../../../components/layout/FormStepsLayout";

export interface SignUpStepOneProps {
  onPrev?: () => void;
  onNext: () => void;
}

export const SignUpStepOne = ({ onPrev, onNext }: SignUpStepOneProps) => {
  return (
    <FormStepsLayout {...{ onPrev, onNext }}>
      <Input name="firstName" placeholder="First Name" autoCapitalize="none" />
      <Input name="lastName" placeholder="Last Name" autoCapitalize="none" />
    </FormStepsLayout>
  );
};
