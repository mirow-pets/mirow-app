import React from "react";

import { DateInput } from "@/components/form/DateInput";
import { Input } from "@/components/form/Input";
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
