import React from "react";
import { Text, View } from "react-native";

import { useTheme } from "react-native-paper";

import { PhoneNumberInput } from "@/components/form/PhoneNumberInput";
import { PlacesInput } from "@/components/form/PlacesInput";
import { TextInputField } from "@/components/form/TextInputField";
import { ThemedText } from "@/components/themed-text";

import { FormStepsLayout } from "../../../../components/layout/FormStepsLayout";

export interface SignUpStepTwoProps {
  onPrev?: () => void;
  onNext: () => void;
}

export const SignUpStepTwo = ({ onNext, onPrev }: SignUpStepTwoProps) => {
  const theme = useTheme();

  return (
    <FormStepsLayout {...{ onNext, onPrev, progress: 0.4 }}>
      <View style={{ marginBottom: 32 }}>
        <ThemedText type="subtitle" style={{ fontSize: 24 }}>
          Let&apos;s set you up!
        </ThemedText>
        <ThemedText>
          We&apos;re so glad you&apos;re here! Just a few quick details about
          you and your pets helps us make sure you find the best care in the
          neighborhood.
        </ThemedText>
      </View>
      <PhoneNumberInput
        label="Phone"
        name="phone"
        placeholder="Phone"
        mode="flat"
      />
      <TextInputField
        label="Address"
        name="address"
        placeholder="Address"
        mode="flat"
      />
      <View
        style={{
          backgroundColor: theme.colors.primary,
          padding: 16,
          borderRadius: 6,
          marginBottom: 16,
        }}
      >
        <Text>
          We are currently provide services only in the state of Florida, US. We
          appreciate your understanding and will expand access in the future
        </Text>
      </View>
      <PlacesInput placeholder="Search City, State and Country" mode="flat" />
      <TextInputField
        label="Postal code"
        name="postalCode"
        placeholder="Postal Code"
        mode="flat"
      />
    </FormStepsLayout>
  );
};
