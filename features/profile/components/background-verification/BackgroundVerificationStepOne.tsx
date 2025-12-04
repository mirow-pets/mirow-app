import React from "react";

import { Input } from "@/components/form/Input";
import { NumberInput } from "@/components/form/NumberInput";
import { FormStepsLayout } from "@/components/layout/FormStepsLayout";

export interface BackgroungVerificationStepOneProps {
  onPrev?: () => void;
  onNext: () => void;
}

export const BackgroungVerificationStepOne = ({
  onPrev,
  onNext,
}: BackgroungVerificationStepOneProps) => {
  return (
    <FormStepsLayout {...{ onPrev, onNext }}>
      <Input name="accHolderName" placeholder="Account Holder Name" />
      <NumberInput name="accNum" placeholder="Account Number" />
      <NumberInput name="routingNumber" placeholder="Routing Number" />
    </FormStepsLayout>
  );
};
