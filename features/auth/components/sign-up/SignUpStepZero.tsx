import React, { useState } from "react";
import { View } from "react-native";

import { Checkbox } from "expo-checkbox";
import { Href, router } from "expo-router";

import { FormField } from "@/components/form/FormField";
import { ThemedText } from "@/components/themed-text";
import { whiteColor } from "@/constants/theme";
import { useAuth } from "@/hooks/use-auth";
import { useThemeColor } from "@/hooks/use-theme-color";

import { FormStepsLayout } from "../../../../components/layout/FormStepsLayout";

export interface SignUpStepZeroProps {
  onPrev?: () => void;
  onNext: () => void;
}

export const SignUpStepZero = ({ onPrev, onNext }: SignUpStepZeroProps) => {
  const { userRole } = useAuth();
  const primaryColor = useThemeColor({}, "primary");
  const [isChecked, setIsChecked] = useState(false);

  const handleTermsAndConditions = () => {
    router.push(`/${userRole}/terms-and-conditions` as Href);
  };

  const handlePrivacyPolicy = () => {
    router.push(`/${userRole}/privacy-policy` as Href);
  };

  return (
    <FormStepsLayout {...{ onPrev, onNext, nextDisabled: !isChecked }}>
      <FormField
        name="agree"
        render={() => (
          <View
            style={{
              backgroundColor: whiteColor,
              padding: 16,
              borderRadius: 8,
              flexDirection: "row",
              gap: 8,
              alignItems: "center",
            }}
          >
            <Checkbox
              value={isChecked}
              onValueChange={setIsChecked}
              color={primaryColor}
            />
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <ThemedText style={{ fontSize: 12 }}>
                By continuing, I confirm that I am at least 17 years old and
                agree to Mirow&apos;s
              </ThemedText>
              <ThemedText
                style={{
                  fontSize: 12,
                  textDecorationLine: "underline",
                  color: primaryColor,
                }}
                onPress={handleTermsAndConditions}
              >
                Terms & Conditions
              </ThemedText>
              <ThemedText style={{ fontSize: 12 }}> and </ThemedText>
              <ThemedText
                style={{
                  fontSize: 12,
                  textDecorationLine: "underline",
                  color: primaryColor,
                }}
                onPress={handlePrivacyPolicy}
              >
                Privacy Policy
              </ThemedText>
              <ThemedText style={{ fontSize: 12 }}>.</ThemedText>
            </View>
          </View>
        )}
      />
    </FormStepsLayout>
  );
};
