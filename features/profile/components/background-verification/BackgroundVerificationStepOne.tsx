import React from "react";
import { View } from "react-native";

import { TextInputField } from "@/components/form/TextInputField";
import { FormStepsLayout } from "@/components/layout/FormStepsLayout";
// import { useCaregiver } from "@/hooks/use-caregiver";

export interface BackgroungVerificationStepOneProps {
  onPrev?: () => void;
  onNext: () => void;
}

export const BackgroungVerificationStepOne = ({
  onPrev,
  onNext,
}: BackgroungVerificationStepOneProps) => {
  // const { documentTypeOptions } = useCaregiver();

  // const documentUrl = form.watch("documentUrl");

  return (
    <FormStepsLayout {...{ onPrev, onNext, progress: 0 }}>
      <View style={{ gap: 16 }}>
        {/* <ThemedText>
          Please provide one of the following valid document
        </ThemedText>
        <ThemedText>
          To prioritize safety and security, we require valid documentation and
          credentials.
        </ThemedText>
        <DropdownInput
          label="Document type"
          name="documentTypes"
          options={documentTypeOptions}
          placeholder="Select document type"
        />
        <ThemedText>Document</ThemedText>
        <DocumentImage
          src={documentUrl}
          onChange={(url) => form.setValue("documentUrl", url)}
          height={80}
          width={80}
          isEditable
        /> */}
        {/* <ThemedText type="error">
          {form.formState.errors.documentUrl?.message?.toString()}
        </ThemedText> */}
        <TextInputField
          label="Driver license"
          name="drivingLicense"
          placeholder="A2355578"
        />
        <TextInputField
          label="Driver license state"
          name="driverLicenseState"
          placeholder="Ex., CA, FL, NY..."
        />
      </View>
    </FormStepsLayout>
  );
};
