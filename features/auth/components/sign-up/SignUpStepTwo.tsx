import React from "react";
import { Text, View } from "react-native";

import { Input } from "@/components/form/Input";
import { PlacesInput } from "@/components/form/PlacesInput";
import { primaryColor } from "@/constants/theme";

import { FormStepsLayout } from "../../../../components/layout/FormStepsLayout";

export interface SignUpStepTwoProps {
  onPrev?: () => void;
  onNext: () => void;
}

export const SignUpStepTwo = ({ onNext, onPrev }: SignUpStepTwoProps) => {
  return (
    <FormStepsLayout {...{ onNext, onPrev }}>
      <Input name="address" placeholder="Address" />
      <View
        style={{
          backgroundColor: primaryColor,
          padding: 16,
          borderRadius: 6,
        }}
      >
        <Text>
          We are currently provide services only in the state of Florida, US. We
          appreciate your understanding and will expand access in the future
        </Text>
      </View>
      <PlacesInput placeholder="Search City, State and Country" />
      <Input name="postalCode" placeholder="Postal Code" />
    </FormStepsLayout>
  );
};
