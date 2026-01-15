import React from "react";
import { StyleSheet, View } from "react-native";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { FormProvider, useForm } from "react-hook-form";

import { Button } from "@/components/button/Button";
import { Input } from "@/components/form/Input";
import { updateCaregiverProfileSchema } from "@/features/profile/validations";
import { useCaregiverProfile } from "@/hooks/caregiver/use-caregiver-profile";
import { useExitFormRouteWarning } from "@/hooks/use-exit-form-route";
import { useThemeColor } from "@/hooks/use-theme-color";

export default function BioDescriptionScreen() {
  const router = useRouter();
  const { profile, updateProfile, isUpdatingProfile } = useCaregiverProfile();
  const primaryColor = useThemeColor({}, "primary");

  const form = useForm({
    resolver: zodResolver(updateCaregiverProfileSchema),
    defaultValues: {
      bioDescription: profile?.users?.bioDescription,
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

    updateProfile(
      {
        ...values,
        bioDescription: values.bioDescription,
      },
      {
        onSuccess: () => {
          form.reset();
          router.replace("/caregiver/profile");
        },
      }
    );
  };

  return (
    <FormProvider {...form}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: primaryColor,
          },
        ]}
      >
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
          loading={isUpdatingProfile}
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
  },
});
