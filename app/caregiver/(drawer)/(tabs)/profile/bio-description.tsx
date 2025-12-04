import React from "react";
import { StyleSheet, View } from "react-native";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { FormProvider, useForm } from "react-hook-form";

import { Button } from "@/components/button/Button";
import { Input } from "@/components/form/Input";
import { primaryColor } from "@/constants/theme";
import { updateCaregiverProfileSchema } from "@/features/profile/validations";
import { useExitFormRouteWarning } from "@/hooks/use-exit-form-route";
import { useProfile } from "@/hooks/use-profile";

export default function BioDescriptionScreen() {
  const router = useRouter();
  const {
    caregiverProfile,
    updateCaregiverProfile,
    isUpdatingCaregiverProfile,
  } = useProfile();

  const form = useForm({
    resolver: zodResolver(updateCaregiverProfileSchema),
    defaultValues: {
      bioDescription: caregiverProfile?.users?.bioDescription,
    },
  });

  const values = form.watch();

  useExitFormRouteWarning({
    isDirty: form.formState.isDirty,
    onExit: () => {
      form.reset();
    },
  });

  const handleSubmit = async () => {
    const result = await form.trigger("bioDescription");
    if (!result) return;

    updateCaregiverProfile(
      {
        ...values,
        bioDescription: values.bioDescription,
      },
      () => {
        form.reset();
        router.replace("/caregiver/profile");
      }
    );
  };

  return (
    <FormProvider {...form}>
      <View style={styles.container}>
        <Input
          label="Bio description"
          name="bioDescription"
          placeholder="Please enter anything about yourself"
          multiline
          numberOfLines={3}
        />
        <Button
          title="Save"
          onPress={handleSubmit}
          loading={isUpdatingCaregiverProfile}
          color="secondary"
        />
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
    backgroundColor: primaryColor,
  },
});
