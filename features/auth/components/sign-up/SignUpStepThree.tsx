import React from "react";

import { Input } from "@/components/form/Input";
import { PhoneNumberInput } from "@/components/form/PhoneNumberInput";

import { FormStepsLayout } from "../../../../components/layout/FormStepsLayout";

export interface SignUpStepThreeProps {
  onPrev?: () => void;
  onNext: () => void;
}

export const SignUpStepThree = ({ onNext, onPrev }: SignUpStepThreeProps) => {
  return (
    <FormStepsLayout {...{ onNext, onPrev }}>
      <Input name="email" placeholder="Email" autoCapitalize="none" />
      <PhoneNumberInput name="phone" placeholder="Phone" />
    </FormStepsLayout>
  );
};
