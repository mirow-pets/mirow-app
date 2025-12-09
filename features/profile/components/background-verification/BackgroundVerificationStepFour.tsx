import React from "react";
import { View } from "react-native";

import { FormStepsLayout } from "@/components/layout/FormStepsLayout";
import { ThemedText } from "@/components/themed-text";

export interface BackgroungVerificationStepFourProps {
  loading?: boolean;
  onPrev?: () => void;
  onNext: () => void;
}

export const BackgroungVerificationStepFour = ({
  loading,
  onPrev,
  onNext,
}: BackgroungVerificationStepFourProps) => {
  return (
    <FormStepsLayout {...{ loading, onPrev, onNext }}>
      <ThemedText type="defaultSemiBold">
        Please double check your information
      </ThemedText>
      <ThemedText>
        The details you provided will be used to run a background check through
        our verification partner, Checkr.
      </ThemedText>
      <ThemedText>
        Note: We check your background again every 12 months.
      </ThemedText>
      <View style={{ borderWidth: 1, padding: 16, borderRadius: 8 }}>
        <ThemedText>
          Please make sure everything is accurate before continuing.
        </ThemedText>
      </View>
    </FormStepsLayout>
  );
};
