import React, { useRef } from "react";
import { View } from "react-native";

import { TextInputField } from "@/components/form/TextInputField";
import { FormStepsLayout } from "@/components/layout/FormStepsLayout";
import { ThemedText } from "@/components/themed-text";
import { centToMajorUnit, formatCurrency } from "@/utils";

export interface BackgroungVerificationStepThreeProps {
  promoCode?: string;
  loading?: boolean;
  backgroundCheckFee: number;
  convenienceFee: number;
  onPrev?: () => void;
  onNext: () => void;
  onPromocodeChange: (_promoCode?: string) => void;
}

export const BackgroungVerificationStepThree = ({
  promoCode,
  loading,
  backgroundCheckFee,
  convenienceFee,
  onPrev,
  onNext,
  onPromocodeChange,
}: BackgroungVerificationStepThreeProps) => {
  const backgroundFeeMajorUnit = centToMajorUnit(backgroundCheckFee);

  // Debounce in React Native using useRef and setTimeout
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handlePromocode = (promoCode: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      onPromocodeChange(promoCode);
    }, 300);
  };

  return (
    <FormStepsLayout {...{ loading, onPrev, onNext, progress: 60 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <ThemedText>Background check fee:</ThemedText>
        <ThemedText>
          {backgroundFeeMajorUnit
            ? formatCurrency(backgroundFeeMajorUnit)
            : "Free"}
        </ThemedText>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <ThemedText>Convenience fee:</ThemedText>
        <ThemedText>
          {backgroundFeeMajorUnit ? formatCurrency(convenienceFee) : "Free"}
        </ThemedText>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <ThemedText>Total fee:</ThemedText>
        <ThemedText>
          {backgroundFeeMajorUnit
            ? formatCurrency(backgroundFeeMajorUnit + Number(convenienceFee))
            : "Free"}
        </ThemedText>
      </View>
      <View>
        <TextInputField
          label="Promo code"
          name=""
          placeholder="Promo code"
          onChangeText={handlePromocode}
          defaultValue={promoCode}
        />
      </View>
    </FormStepsLayout>
  );
};
