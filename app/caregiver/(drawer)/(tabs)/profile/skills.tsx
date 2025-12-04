import React from "react";
import { StyleSheet, View } from "react-native";

import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "expo-checkbox";
import { router } from "expo-router";
import { FormProvider, useForm } from "react-hook-form";

import { Button } from "@/components/button/Button";
import { ThemedText } from "@/components/themed-text";
import { primaryColor, secondaryColor } from "@/constants/theme";
import { updateCaregiverProfileSchema } from "@/features/profile/validations";
import { useAuth } from "@/hooks/use-auth";
import { useExitFormRouteWarning } from "@/hooks/use-exit-form-route";
import { useProfile } from "@/hooks/use-profile";
import { TCaregiverSkill } from "@/types";

export default function SkillsScreen() {
  const { currUser } = useAuth();
  const {
    careGiverSkillOptions,
    caregiverProfile,
    updateCaregiverProfile,
    isUpdatingCaregiverProfile,
  } = useProfile();

  const form = useForm({
    resolver: zodResolver(updateCaregiverProfileSchema),
    defaultValues: {
      careGiverSkills:
        caregiverProfile?.careGiverSkills?.map(({ id }) => id) ?? [],
    },
  });

  const values = form.watch();

  const { careGiverSkills } = values;

  useExitFormRouteWarning({
    isDirty: form.formState.isDirty,
    onExit: () => {
      form.reset();
    },
  });

  const handleSubmit = async () => {
    const result = await form.trigger("careGiverSkills");
    if (!result) return;

    updateCaregiverProfile(values, () => {
      form.reset();
      router.replace("/caregiver/profile");
    });
  };

  return (
    <FormProvider {...form}>
      <View style={styles.container}>
        {careGiverSkillOptions.map(({ label, value }, i) => {
          const isChecked = careGiverSkills.includes(
            value as TCaregiverSkill["id"]
          );

          const handleOnValueChange = (isChecked: boolean) => {
            const newSkills = isChecked
              ? [...careGiverSkills, value as TCaregiverSkill["id"]]
              : careGiverSkills.filter((skillId) => skillId !== value);
            form.setValue("careGiverSkills", newSkills);
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
        <ThemedText type="error">
          {form.formState.errors.careGiverSkills?.message?.toString()}
        </ThemedText>
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
