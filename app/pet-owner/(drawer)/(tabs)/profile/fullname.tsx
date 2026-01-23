import React from "react";
import { StyleSheet, View } from "react-native";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { FormProvider, useForm } from "react-hook-form";

import { Button } from "@/components/button/Button";
import { TextInputField } from "@/components/form/TextInputField";
import { updatePetOwnerProfileSchema } from "@/features/profile/validations";
import { usePetOwnerProfile } from "@/hooks/pet-owner/use-pet-owner-profile";
import { useExitFormRouteWarning } from "@/hooks/use-exit-form-route";

export default function FullnameScreen() {
  const router = useRouter();
  const { profile, updateProfile, isUpdatingProfile } = usePetOwnerProfile();

  const form = useForm({
    resolver: zodResolver(updatePetOwnerProfileSchema),
    defaultValues: {
      firstName: profile?.firstName,
      lastName: profile?.lastName,
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
      <View style={styles.container}>
        <TextInputField
          label="First name"
          name="firstName"
          placeholder="First name"
        />
        <TextInputField
          label="Last name"
          name="lastName"
          placeholder="Last name"
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
    gap: 16,
  },
});
