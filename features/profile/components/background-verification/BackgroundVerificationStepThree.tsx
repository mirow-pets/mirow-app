import React from "react";
import { View } from "react-native";

import { FormStepsLayout } from "@/components/layout/FormStepsLayout";
import { ThemedText } from "@/components/themed-text";
import { formatCurrency } from "@/utils";

export interface BackgroungVerificationStepThreeProps {
  backgroundCheckFee: number;
  convenienceFee: number;
  onPrev?: () => void;
  onNext: () => void;
}

export const BackgroungVerificationStepThree = ({
  backgroundCheckFee,
  convenienceFee,
  onPrev,
  onNext,
}: BackgroungVerificationStepThreeProps) => {
  return (
    <FormStepsLayout {...{ onPrev, onNext }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <ThemedText>Backround check fee:</ThemedText>
        <ThemedText>{formatCurrency(backgroundCheckFee)}</ThemedText>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <ThemedText>Convenience fee:</ThemedText>
        <ThemedText>{formatCurrency(convenienceFee)}</ThemedText>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <ThemedText>Total fee:</ThemedText>
        <ThemedText>
          {formatCurrency(Number(backgroundCheckFee) + Number(convenienceFee))}
        </ThemedText>
      </View>
    </FormStepsLayout>
  );
};
