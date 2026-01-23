import React from "react";
import { StyleSheet, View } from "react-native";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { FormProvider, useForm } from "react-hook-form";
import Toast from "react-native-toast-message";

import { Button } from "@/components/button/Button";
import { PlacesInput } from "@/components/form/PlacesInput";
import { TextInputField } from "@/components/form/TextInputField";
import { ThemedText } from "@/components/themed-text";
import {
  TUpdateAddress,
  updatePetOwnerProfileSchema,
} from "@/features/profile/validations";
import { usePetOwnerProfile } from "@/hooks/pet-owner/use-pet-owner-profile";
import { useAuth } from "@/hooks/use-auth";
import { useExitFormRouteWarning } from "@/hooks/use-exit-form-route";
import { useRefetchQueries } from "@/hooks/use-refetch-queries";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Patch } from "@/services/http-service";

export default function AddressScreen() {
  const router = useRouter();
  const { currUser } = useAuth();
  const { refetch } = useRefetchQueries();
  const { profile } = usePetOwnerProfile();
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

  const { mutate, isPending } = useMutation<void, Error, TUpdateAddress>({
    mutationFn: (input) => Patch("/users/address", input),
    onSuccess: () => {
      const queryKeys = [
        ["caregiver-profile", currUser?.sessionId],
        ["caregiver-profile-completion", currUser?.sessionId],
      ];

      refetch(queryKeys);

      form.reset();
      router.replace("/pet-owner/profile");

      Toast.show({
        type: "success",
        text1: "Pet owner address updated successfully!",
      });
    },
  });

  useExitFormRouteWarning({
    isDirty: form.formState.isDirty,
    onExit: () => {
      form.reset();
    },
  });

  const handleSubmit = async () => {
    const result = await form.trigger(["address", "city", "postalCode"]);
    if (!result) return;

    mutate(form.getValues());
  };

  return (
    <FormProvider {...form}>
      <View style={styles.container}>
        <TextInputField label="Address" name="address" placeholder="Address" />
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
        <TextInputField
          label="Postal code"
          name="postalCode"
          placeholder="Postal Code"
        />
        <Button onPress={handleSubmit} loading={isPending} color="secondary">
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
