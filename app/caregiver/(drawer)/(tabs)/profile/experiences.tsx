import React from "react";
import { StyleSheet, View } from "react-native";

import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "expo-checkbox";
import { useRouter } from "expo-router";
import { FormProvider, useForm } from "react-hook-form";

import { Button } from "@/components/button/Button";
import { NumberInput } from "@/components/form/NumberInput";
import { ThemedText } from "@/components/themed-text";
import { primaryColor, secondaryColor } from "@/constants/theme";
import { updateCaregiverProfileSchema } from "@/features/profile/validations";
import { useCaregiverCaregiver } from "@/hooks/caregiver/use-caregiver-caregiver";
import { useCaregiverProfile } from "@/hooks/caregiver/use-caregiver-profile";
import { useExitFormRouteWarning } from "@/hooks/use-exit-form-route";
import { TCaregiverPreference } from "@/types";

export default function ExperiencesScreen() {
  const router = useRouter();
  const { profile, updateProfile, isUpdatingProfile } = useCaregiverProfile();
  const { petTypeOptions } = useCaregiverCaregiver();

  const form = useForm({
    resolver: zodResolver(updateCaregiverProfileSchema),
    defaultValues: {
      experience: profile?.experience,
      petTypes: profile?.petTypes?.map(({ id }) => id) ?? [],
    },
  });

  const values = form.watch();

  const { petTypes } = values;

  useExitFormRouteWarning({
    isDirty: form.formState.isDirty,
    onExit: () => {
      form.reset();
    },
  });

  const handleSubmit = async () => {
    const result = await form.trigger("petTypes");
    if (!result) return;

    updateProfile(
      {
        ...values,
        experience: Number(values.experience),
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
      <View style={styles.container}>
        <NumberInput
          label="Experience"
          name="experience"
          placeholder="Experience"
        />
        <ThemedText type="defaultSemiBold">Types of pets cared for:</ThemedText>
        <View>
          {petTypeOptions.map(({ label, value }, i) => {
            const isChecked = petTypes.includes(
              value as TCaregiverPreference["id"]
            );

            const handleOnValueChange = (isChecked: boolean) => {
              const newPetTypes = isChecked
                ? [...petTypes, value as TCaregiverPreference["id"]]
                : petTypes.filter((preferenceId) => preferenceId !== value);
              form.setValue("petTypes", newPetTypes);
            };

            return (
              <View key={i} style={{ flexDirection: "row", gap: 8 }}>
                <Checkbox
                  value={isChecked}
                  onValueChange={handleOnValueChange}
                  color={secondaryColor}
                />
                <ThemedText>{label}</ThemedText>
              </View>
            );
          })}
        </View>
        <ThemedText type="error">
          {form.formState.errors.petTypes?.message?.toString()}
        </ThemedText>
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
    backgroundColor: primaryColor,
  },
});
