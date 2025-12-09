import React from "react";
import { StyleSheet, View } from "react-native";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { FormProvider, useForm } from "react-hook-form";

import { Button } from "@/components/button/Button";
import { Input } from "@/components/form/Input";
import { PlacesInput } from "@/components/form/PlacesInput";
import { ThemedText } from "@/components/themed-text";
import { updatePetOwnerProfileSchema } from "@/features/profile/validations";
import { usePetOwnerProfile } from "@/hooks/pet-owner/use-pet-owner-profile";
import { useExitFormRouteWarning } from "@/hooks/use-exit-form-route";
import { useThemeColor } from "@/hooks/use-theme-color";

export default function AddressScreen() {
  const router = useRouter();
  const { profile, updateProfile, isUpdatingProfile } = usePetOwnerProfile();
  const primaryColor = useThemeColor({}, "primary");
  const address = profile?.address[0];

  const form = useForm({
    resolver: zodResolver(updatePetOwnerProfileSchema),
    defaultValues: {
      address: address?.address,
      city: address?.city,
      state: address?.state,
      country: address?.country,
      postalCode: address?.postalCode,
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
    const result = await form.trigger(["address", "city", "postalCode"]);
    if (!result) return;

    updateProfile(form.getValues(), () => {
      form.reset();
      router.replace("/caregiver/profile");
    });
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
        <Input name="address" placeholder="Address" />
        <View
          style={{
            backgroundColor: primaryColor,
            padding: 16,
            borderRadius: 6,
          }}
        >
          <ThemedText>
            We are currently provide services only in the state of Florida, US.
            We appreciate your understanding and will expand access in the
            future
          </ThemedText>
        </View>
        <PlacesInput placeholder="Search City, State and Country" />
        <Input name="postalCode" placeholder="Postal Code" />
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
    alignItems: "center",
    padding: 20,
    gap: 16,
  },
});
