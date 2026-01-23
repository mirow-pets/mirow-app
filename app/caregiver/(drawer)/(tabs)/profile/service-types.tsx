import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { FormProvider, useForm } from "react-hook-form";
import { ScrollView } from "react-native-gesture-handler";
import { Checkbox, HelperText } from "react-native-paper";
import Toast from "react-native-toast-message";

import { Button } from "@/components/button/Button";
import { ThemedText } from "@/components/themed-text";
import { ServicesForm } from "@/features/profile/components/ServicesForm";
import {
  TUpdateCaregiverServices,
  updateCaregiverServicesSchema,
} from "@/features/profile/validations";
import { useCaregiverCaregiver } from "@/hooks/caregiver/use-caregiver-caregiver";
import { useCaregiverProfile } from "@/hooks/caregiver/use-caregiver-profile";
import { useAuth } from "@/hooks/use-auth";
import { useExitFormRouteWarning } from "@/hooks/use-exit-form-route";
import { useRefetchQueries } from "@/hooks/use-refetch-queries";
import { Patch } from "@/services/http-service";
import { THomeType, TServiceType, TTransportType } from "@/types";
import { TCareGiversServiceTypesLink } from "@/types/caregivers";
import { centToMajorUnit, majorToCentUnit } from "@/utils";

export default function ServiceTypesScreen() {
  const router = useRouter();
  const { currUser } = useAuth();
  const { serviceTypes, homeTypeOptions, transportTypeOptions } =
    useCaregiverCaregiver();
  const { profile } = useCaregiverProfile();
  const { refetch } = useRefetchQueries();

  const { mutate, isPending } = useMutation({
    mutationFn: (input: TUpdateCaregiverServices) =>
      Patch("/v2/caregivers/services", {
        ...input,
        services: input.services.map((service) => ({
          ...service,
          serviceRate:
            service.serviceRate && majorToCentUnit(service.serviceRate),
        })),
      }),
    onSuccess: async () => {
      form.reset();

      await refetch([
        ["caregiver-profile", currUser?.sessionId],
        ["caregiver-profile-completion", currUser?.sessionId],
      ]);

      router.replace("/caregiver/profile");

      Toast.show({
        type: "success",
        text1: "Caregiver services updated successfully!",
      });
    },
  });

  const transportation = serviceTypes?.find(
    ({ type }) => type === "transportation",
  );
  const transportId = transportation?.id;

  const caregiverServiceTypeMapper = useMemo(() => {
    const mapper: Record<number, TCareGiversServiceTypesLink> = [];

    profile?.careGiversServiceTypesLink?.forEach((serviceType) => {
      mapper[serviceType.serviceTypesId] = serviceType;
    });

    return mapper;
  }, [profile.careGiversServiceTypesLink]);

  const serviceTypeMapper = useMemo(() => {
    const mapper: Record<number, TServiceType> = [];

    serviceTypes?.forEach((serviceType) => {
      mapper[serviceType.id] = serviceType;
    });

    return mapper;
  }, [serviceTypes]);

  const defaultServices =
    serviceTypes?.map((service) => ({
      id: service.id,
      isActive: !!caregiverServiceTypeMapper[service.id],
      serviceRate:
        caregiverServiceTypeMapper[service.id]?.serviceRate &&
        centToMajorUnit(caregiverServiceTypeMapper[service.id]?.serviceRate),
    })) ?? [];

  const validation = updateCaregiverServicesSchema
    .superRefine(({ services, transportIds }, ctx) => {
      // Ensure transportIds is required if "transportation" service is active
      if (
        !services?.some(
          (service) => service.id === transportId && service.isActive,
        )
      )
        return;
      if (transportIds && transportIds.length > 0) return;

      ctx.addIssue({
        code: "custom",
        message: "Transport type is required",
        path: ["transportIds"],
      });
    })
    .superRefine(({ services }, ctx) => {
      services.forEach((service, idx) => {
        if (!service.isActive) return;
        if (typeof service.serviceRate !== "number") {
          ctx.addIssue({
            code: "custom",
            message: "Service rate is required",
            path: ["services", idx, "serviceRate"],
          });
        }
        const minServiceRate = centToMajorUnit(
          serviceTypeMapper[service.id].minServiceRate,
        );
        if (service.serviceRate && minServiceRate > service.serviceRate) {
          ctx.addIssue({
            code: "custom",
            message: `Service rate must be at least ${minServiceRate}`,
            path: ["services", idx, "serviceRate"],
          });
        }
      });
    });

  const form = useForm({
    resolver: zodResolver(validation),
    defaultValues: {
      services: defaultServices,
      homeTypesIds: profile?.homeTypes?.map(({ id }) => id) ?? [],
      transportIds: profile?.transportType?.map(({ id }) => id) ?? [],
    },
  });

  const values = form.watch();

  const enabledTransportTypes = useMemo(() => {
    if (!transportId) return false;

    const isTransportationExists = values.services.find(
      (service) => service.id === transportId && service.isActive,
    );

    if (isTransportationExists) return true;
    else {
      form.setValue("transportIds", []);
      return false;
    }
    // useEffect/useMemo dependencies cannot deeply compare arrays/objects,
    // so use JSON.stringify for deep equals watching, or use a primitive selector
  }, [values.services, JSON.stringify(values.services), form, transportId]);

  const { homeTypesIds, transportIds } = values;

  useExitFormRouteWarning({
    isDirty: form.formState.isDirty,
    onExit: () => {
      form.reset();
    },
  });

  const submit = (input: TUpdateCaregiverServices) => {
    mutate(input);
  };

  return (
    <FormProvider {...form}>
      <ScrollView>
        <View style={styles.container}>
          <ThemedText type="defaultSemiBold">Services:</ThemedText>
          <ServicesForm />
          <HelperText type="error">
            {form.formState.errors.services?.message?.toString()}
          </HelperText>
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
          </View>
          <HelperText type="error">
            {form.formState.errors.homeTypesIds?.message?.toString()}
          </HelperText>
          {enabledTransportTypes && (
            <>
              <ThemedText type="defaultSemiBold">
                Transporation Types:
              </ThemedText>
              <View>
                {transportTypeOptions.map(({ label, value }, i) => {
                  const isChecked = transportIds.includes(
                    value as TTransportType["id"],
                  );

                  const handleOnValueChange = (isChecked: boolean) => {
                    const newTransportationTypes = isChecked
                      ? [...transportIds, value as TTransportType["id"]]
                      : transportIds.filter(
                          (transportId) => transportId !== value,
                        );
                    form.setValue("transportIds", newTransportationTypes);
                  };

                  return (
                    <View
                      key={i}
                      style={{
                        flexDirection: "row",
                        gap: 8,
                        alignItems: "center",
                      }}
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
              </View>
            </>
          )}
          <HelperText type="error">
            {form.formState.errors.transportIds?.message?.toString()}
          </HelperText>
          <Button
            onPress={form.handleSubmit(submit)}
            loading={isPending}
            color="secondary"
          >
            Save
          </Button>
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
    gap: 16,
  },
});
