import React from "react";
import { StyleSheet, View } from "react-native";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { FormProvider, useForm } from "react-hook-form";
import { Checkbox, HelperText } from "react-native-paper";

import { Button } from "@/components/button/Button";
import { ThemedText } from "@/components/themed-text";
import { updateCaregiverProfileSchema } from "@/features/profile/validations";
import { useCaregiverProfile } from "@/hooks/caregiver/use-caregiver-profile";
import { useExitFormRouteWarning } from "@/hooks/use-exit-form-route";
import { TCaregiverPreference } from "@/types";

export default function PreferencesScreen() {
  const router = useRouter();
  const {
    caregiverPreferenceOptions,
    profile,
    updateProfile,
    isUpdatingProfile,
  } = useCaregiverProfile();

  const form = useForm({
    resolver: zodResolver(updateCaregiverProfileSchema),
    defaultValues: {
      careGiverPreferences:
        profile?.careGiverPreferences?.map(({ id }) => id) ?? [],
    },
  });

  const values = form.watch();

  const { careGiverPreferences } = values;

  useExitFormRouteWarning({
    isDirty: form.formState.isDirty,
    onExit: () => {
      form.reset();
    },
  });

  const handleSubmit = async () => {
    const result = await form.trigger("careGiverPreferences");
    if (!result) return;

    updateProfile(values, {
      onSuccess: () => {
        form.reset();
        router.replace("/caregiver/account");
      },
    });
  };

  return (
    <FormProvider {...form}>
      <View style={styles.container}>
        {caregiverPreferenceOptions.map(({ label, value }, i) => {
          const isChecked = careGiverPreferences.includes(
            value as TCaregiverPreference["id"]
          );

          const handleOnValueChange = (isChecked: boolean) => {
            const newPreferences = isChecked
              ? [...careGiverPreferences, value as TCaregiverPreference["id"]]
              : careGiverPreferences.filter(
                  (preferenceId) => preferenceId !== value
                );
            form.setValue("careGiverPreferences", newPreferences);
          };

          return (
            <View
              key={i}
              style={{ flexDirection: "row", gap: 8, alignItems: "center" }}
            >
              <Checkbox
                status={isChecked ? "checked" : "unchecked"}
                onPress={() => handleOnValueChange(!isChecked)}
              />
              <View style={{ flex: 1, minWidth: 0 }}>
                <ThemedText>{label}</ThemedText>
              </View>
            </View>
          );
        })}
        <HelperText type="error">
          {form.formState.errors.careGiverPreferences?.message?.toString()}
        </HelperText>
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
