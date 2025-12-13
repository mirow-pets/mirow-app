import React, { useCallback, useMemo } from "react";
import { StyleSheet, View } from "react-native";

import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "expo-checkbox";
import { useRouter } from "expo-router";
import { FormProvider, useForm } from "react-hook-form";
import { ScrollView } from "react-native-gesture-handler";

import { Button } from "@/components/button/Button";
import { NumberInput } from "@/components/form/NumberInput";
import { ThemedText } from "@/components/themed-text";
import { primaryColor, secondaryColor } from "@/constants/theme";
import { updateCaregiverProfileSchema } from "@/features/profile/validations";
import { useCaregiverCaregiver } from "@/hooks/caregiver/use-caregiver-caregiver";
import { useCaregiverProfile } from "@/hooks/caregiver/use-caregiver-profile";
import { useExitFormRouteWarning } from "@/hooks/use-exit-form-route";
import { TCaregiverPreference, THomeType, TTransportType } from "@/types";

export default function ServiceTypesScreen() {
  const router = useRouter();
  const {
    serviceTypes,
    serviceTypeOptions,
    homeTypeOptions,
    transportTypeOptions,
  } = useCaregiverCaregiver();
  const { profile, updateProfile, isUpdatingProfile } = useCaregiverProfile();

  const form = useForm({
    resolver: zodResolver(updateCaregiverProfileSchema),
    defaultValues: {
      services: profile?.serviceTypes?.map(({ id }) => id) ?? [],
      homeTypesIds: profile?.homeTypes?.map(({ id }) => id) ?? [],
      transportIds: profile?.transportType?.map(({ id }) => id) ?? [],
      pricePerHour: profile?.pricePerHour,
      pricePerMile: profile?.pricePerMile,
      pricePerService: profile?.pricePerService,
    },
  });

  const values = form.watch();

  const enabledPrice = useMemo(() => {
    const selectedServiceType = serviceTypes
      ?.filter(({ id }) => values.services.includes(id))
      ?.map((item) => item?.type);

    return {
      isPerHour: selectedServiceType?.some((v) =>
        ["walking", "boarding", "sitting"].includes(v)
      ),
      isPerMile: selectedServiceType?.some((v) =>
        ["transportation"].includes(v)
      ),
      isPerService: selectedServiceType?.some((v) =>
        ["grooming", "meal-prep", "training"].includes(v)
      ),
    };
  }, [values.services, serviceTypes]);

  const enabledTransportTypes = useMemo(() => {
    const transportId = serviceTypes?.find(
      (v) => v.type === "transportation"
    )?.id;
    if (!transportId) return false;

    if (values.services.includes(transportId)) {
      return true;
    } else {
      form.setValue("transportIds", []);
      return false;
    }
  }, [values.services, form, serviceTypes]);

  const {
    services,
    homeTypesIds,
    transportIds,
    pricePerHour,
    pricePerMile,
    pricePerService,
  } = values;

  useExitFormRouteWarning({
    isDirty: form.formState.isDirty,
    onExit: () => {
      form.reset();
    },
  });

  const handleSubmit = useCallback(async () => {
    console.log(enabledPrice);
    const result = await form.trigger([
      "services",
      "homeTypesIds",
      ...(enabledTransportTypes ? ["transportIds"] : []),
      ...(enabledPrice.isPerHour ? ["pricePerHour"] : []),
      ...(enabledPrice.isPerMile ? ["pricePerMile"] : []),
      ...(enabledPrice.isPerService ? ["pricePerService"] : []),
    ] as
      | "services"
      | "homeTypesIds"
      | "transportIds"
      | "pricePerHour"
      | "pricePerMile"
      | "pricePerService"[]);
    if (!result) return;

    updateProfile(
      {
        ...values,
        pricePerHour: pricePerHour && +pricePerHour,
        pricePerMile: pricePerMile && +pricePerMile,
        pricePerService: pricePerService && +pricePerService,
      },
      () => {
        form.reset();
        router.replace("/caregiver/profile");
      }
    );
  }, [
    values,
    enabledPrice,
    enabledTransportTypes,
    form,
    updateProfile,
    pricePerHour,
    pricePerMile,
    pricePerService,
    router,
  ]);

  return (
    <FormProvider {...form}>
      <ScrollView>
        <View style={styles.container}>
          <ThemedText type="defaultSemiBold">Services:</ThemedText>
          <View>
            {serviceTypeOptions.map(({ label, value }, i) => {
              const isChecked = services.includes(
                value as TCaregiverPreference["id"]
              );

              const handleOnValueChange = (isChecked: boolean) => {
                const newHomeTypes = isChecked
                  ? [...services, value as TCaregiverPreference["id"]]
                  : services.filter((serviceTypeId) => serviceTypeId !== value);
                form.setValue("services", newHomeTypes);
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
            {form.formState.errors.services?.message?.toString()}
          </ThemedText>
          <ThemedText type="defaultSemiBold">Home Types:</ThemedText>
          <View>
            {homeTypeOptions.map(({ label, value }, i) => {
              const isChecked = homeTypesIds.includes(value as THomeType["id"]);

              const handleOnValueChange = (isChecked: boolean) => {
                const newHomeTypes = isChecked
                  ? [...homeTypesIds, value as THomeType["id"]]
                  : homeTypesIds.filter((homeTypeId) => homeTypeId !== value);
                form.setValue("homeTypesIds", newHomeTypes);
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
            {form.formState.errors.homeTypesIds?.message?.toString()}
          </ThemedText>
          {enabledTransportTypes && (
            <>
              <ThemedText type="defaultSemiBold">
                Transporation Types:
              </ThemedText>
              <View>
                {transportTypeOptions.map(({ label, value }, i) => {
                  const isChecked = transportIds.includes(
                    value as TTransportType["id"]
                  );

                  const handleOnValueChange = (isChecked: boolean) => {
                    const newTransportationTypes = isChecked
                      ? [...transportIds, value as TTransportType["id"]]
                      : transportIds.filter(
                          (transportId) => transportId !== value
                        );
                    form.setValue("transportIds", newTransportationTypes);
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
            </>
          )}
          <ThemedText type="error">
            {form.formState.errors.transportIds?.message?.toString()}
          </ThemedText>
          {enabledPrice.isPerHour && (
            <NumberInput
              label="Price per hour"
              name="pricePerHour"
              placeholder="Price per hour"
            />
          )}
          {enabledPrice.isPerMile && (
            <NumberInput
              label="Price per mile"
              name="pricePerMile"
              placeholder="Price per mile"
            />
          )}
          {enabledPrice.isPerService && (
            <NumberInput
              label="Price per service"
              name="pricePerService"
              placeholder="Price per service"
            />
          )}
          <Button
            title="Save"
            onPress={handleSubmit}
            loading={isUpdatingProfile}
            color="secondary"
          />
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>
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
