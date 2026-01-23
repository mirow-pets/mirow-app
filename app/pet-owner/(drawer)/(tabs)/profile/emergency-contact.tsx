import React from "react";
import { StyleSheet, View } from "react-native";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { FormProvider, useForm } from "react-hook-form";

import { Button } from "@/components/button/Button";
import { PhoneNumberInput } from "@/components/form/PhoneNumberInput";
import { TextInputField } from "@/components/form/TextInputField";
import { updatePetOwnerProfileSchema } from "@/features/profile/validations";
import { usePetOwnerProfile } from "@/hooks/pet-owner/use-pet-owner-profile";
import { useExitFormRouteWarning } from "@/hooks/use-exit-form-route";

export default function EmergencyContactScreen() {
  const router = useRouter();
  const { profile, updateProfile, isUpdatingProfile } = usePetOwnerProfile();

  const form = useForm({
    resolver: zodResolver(updatePetOwnerProfileSchema),
    defaultValues: {
      eFirstName: profile?.eFirstName,
      eLastName: profile?.eLastName,
      ePhone: profile?.ePhone,
      relationshipName: profile?.relationshipName,
    },
  });

  useExitFormRouteWarning({
    isDirty: form.formState.isDirty,
    onExit: () => {
      form.reset();
    },
  });

  const handleSubmit = async () => {
    const result = await form.trigger([
      "eFirstName",
      "eLastName",
      "ePhone",
      "relationshipName",
    ]);
    if (!result) return;

    updateProfile(form.getValues(), () => {
      form.reset();
      router.replace("/pet-owner/profile");
    });
  };

  return (
    <FormProvider {...form}>
      <View style={styles.container}>
        <TextInputField
          label="First name"
          name="eFirstName"
          placeholder="First name"
        />
        <TextInputField
          label="Last name"
          name="eLastName"
          placeholder="Last name"
        />
        <PhoneNumberInput
          label="Phone"
          name="ePhone"
          placeholder="Phone number"
        />
        <TextInputField
          label="Relationship"
          name="relationshipName"
          placeholder="Relation, Ex: Brother, Friend, etc.,"
        />
        <Button
          onPress={handleSubmit}
          loading={isUpdatingProfile}
          color="secondary"
        >
          Save
        </Button>
      </View>
    </FormProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    padding: 20,
    width: "100%",
    gap: 16,
  },
});
