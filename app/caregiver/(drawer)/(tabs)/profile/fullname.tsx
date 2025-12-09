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

export default function FullnameScreen() {
  const router = useRouter();
  const { profile, updateProfile, isUpdatingProfile } = useCaregiverProfile();
  const primaryColor = useThemeColor({}, "primary");

  const form = useForm({
    resolver: zodResolver(updateCaregiverProfileSchema),
    defaultValues: {
      firstName: profile?.users?.firstName,
      lastName: profile?.users?.lastName,
    },
  });

  useExitFormRouteWarning({
    isDirty: form.formState.isDirty,
    onExit: () => {
      form.reset();
    },
  });

  const handleSubmit = async () => {
    const result = await form.trigger(["firstName", "lastName"]);
    if (!result) return;

    updateProfile(form.getValues(), () => {
      form.reset();
      router.replace("/pet-owner/profile");
    });
  };

  return (
    <FormProvider {...form}>
      <View style={[styles.container, { backgroundColor: primaryColor }]}>
        <Input name="firstName" placeholder="First name" />
        <Input name="lastName" placeholder="Last name" />
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
