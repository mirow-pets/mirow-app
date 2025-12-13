import React from "react";
import { View } from "react-native";

import { useFormContext } from "react-hook-form";

import { FormStepsLayout } from "@/components/layout/FormStepsLayout";
import { ThemedText } from "@/components/themed-text";
import { whiteColor } from "@/constants/theme";

const fieldLabels: Record<string, string> = {
  country: "Country",
  accHolderName: "Account Holder Name",
  routingNumber: "Routing Number",
  accountNumber: "Account Number",
  drivingLicense: "Driving License",
  driverLicenseState: "Driver License State",
  ssn: "SSN",
  dateOfBirth: "Date of Birth",
  customerId: "Customer ID",
};

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
  const form = useFormContext();
  const values = form.watch();
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
      <View
        style={{
          borderWidth: 1,
          padding: 16,
          borderRadius: 8,
          gap: 8,
          backgroundColor: whiteColor,
        }}
      >
        {Object.entries(values).map(([key, value]) => {
          const label = fieldLabels[key] || key; // Get label from mapping, or use key if not found
          if (key === "dateOfBirth") {
            return (
              <ThemedText key={key}>
                {label}: {new Date(value).toLocaleDateString()}
              </ThemedText>
            );
          }
          if (key === "customerId") return null;
          return (
            <ThemedText key={key}>
              {label}: {String(value)}
            </ThemedText>
          );
        })}
      </View>
      <View style={{ borderWidth: 1, padding: 16, borderRadius: 8 }}>
        <ThemedText>
          Please make sure everything is accurate before continuing.
        </ThemedText>
      </View>
    </FormStepsLayout>
  );
};
