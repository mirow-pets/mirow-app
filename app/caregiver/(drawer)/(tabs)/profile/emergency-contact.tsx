import React from "react";
import { StyleSheet, View } from "react-native";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { FormProvider, useForm } from "react-hook-form";

import { Button } from "@/components/button/Button";
import { Input } from "@/components/form/Input";
import { PhoneNumberInput } from "@/components/form/PhoneNumberInput";
import { updateCaregiverProfileSchema } from "@/features/profile/validations";
import { useCaregiverProfile } from "@/hooks/caregiver/use-caregiver-profile";
import { useExitFormRouteWarning } from "@/hooks/use-exit-form-route";
import { useThemeColor } from "@/hooks/use-theme-color";

export default function EmergencyContactScreen() {
  const router = useRouter();
  const { profile, updateProfile, isUpdatingProfile } = useCaregiverProfile();
  const primaryColor = useThemeColor({}, "primary");

  const form = useForm({
    resolver: zodResolver(updateCaregiverProfileSchema),
    defaultValues: {
      eFirstName: profile?.users?.eFirstName,
      eLastName: profile?.users?.eLastName,
      ePhone: profile?.users?.ePhone,
      relationshipName: profile?.users?.relationshipName,
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
      router.replace("/caregiver/profile");
    });
  };

  return (
    <FormProvider {...form}>
      <View style={[styles.container, { backgroundColor: primaryColor }]}>
        <Input name="eFirstName" placeholder="First name" />
        <Input name="eLastName" placeholder="Last name" />
        <PhoneNumberInput name="ePhone" placeholder="Phone number" />
        <Input
          name="relationshipName"
          placeholder="Relation, Ex: Brother, Friend, etc.,"
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
