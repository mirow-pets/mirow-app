import React from "react";

import { DateInput } from "@/components/form/DateInput";
import { Input } from "@/components/form/Input";
import { NumberInput } from "@/components/form/NumberInput";
import { FormStepsLayout } from "@/components/layout/FormStepsLayout";
import { formatSsn } from "@/utils";

export interface BackgroungVerificationStepTwoProps {
  onPrev?: () => void;
  onNext: () => void;
}

export const BackgroungVerificationStepTwo = ({
  onPrev,
  onNext,
}: BackgroungVerificationStepTwoProps) => {
  const eighteenYearsAgo = new Date();
  eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
  eighteenYearsAgo.setDate(eighteenYearsAgo.getDate() - 1);

  return (
    <FormStepsLayout {...{ onPrev, onNext }}>
      <Input
        label="Account holder name"
        name="accHolderName"
        placeholder="Account Holder Name"
      />
      <NumberInput
        label="Account number"
        name="accountNumber"
        placeholder="Account Number"
      />
      <NumberInput
        label="Routing number"
        name="routingNumber"
        placeholder="Routing Number"
      />
      <Input
        label="SSN number"
        name="ssn"
        placeholder="SSN Number"
        formatter={formatSsn}
      />
      <DateInput
        label="Birth of data"
        name="dateOfBirth"
        maximumDate={eighteenYearsAgo}
      />
    </FormStepsLayout>
  );
};
