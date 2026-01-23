import React from "react";
import { View } from "react-native";

import { useFormContext } from "react-hook-form";

import { DateInput } from "@/components/form/DateInput";
import { DropdownInput } from "@/components/form/DropdownInput";
import { TextInputField } from "@/components/form/TextInputField";
import { UserAvatar } from "@/components/image/UserAvatar";
import { FormStepsLayout } from "@/components/layout/FormStepsLayout";
import { ThemedText } from "@/components/themed-text";
import { TSignUp } from "@/features/auth/validations";

export interface SignUpStepOneProps {
  onPrev?: () => void;
  onNext: () => void;
}

export const SignUpStepOne = ({ onPrev, onNext }: SignUpStepOneProps) => {
  const form = useFormContext<TSignUp>();

  const eighteenYearsAgo = new Date();
  eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
  eighteenYearsAgo.setDate(eighteenYearsAgo.getDate() - 1);

  return (
    <FormStepsLayout {...{ onPrev, onNext, progress: 0.2 }}>
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
      <UserAvatar
        isEditable
        size={80}
        onChange={(value) => {
          console.log("IMAGE", value);
          form.setValue("profileImage", value);
        }}
      />
      <TextInputField
        label="First name"
        name="firstName"
        placeholder="First Name"
        autoCapitalize="none"
        mode="flat"
      />
      <TextInputField
        label="Last name"
        name="lastName"
        placeholder="Last Name"
        autoCapitalize="none"
        mode="flat"
      />
      <DropdownInput
        label="Gender"
        name="gender"
        placeholder="Gender"
        options={[
          { label: "Male", value: "MALE" },
          { label: "Female", value: "FEMALE" },
          { label: "Unknown", value: "OTHERS" },
        ]}
        mode="flat"
      />
      <DateInput
        label="Date of birth"
        name="dateOfBirth"
        inputMode="flat"
        maximumDate={eighteenYearsAgo}
      />
    </FormStepsLayout>
  );
};
