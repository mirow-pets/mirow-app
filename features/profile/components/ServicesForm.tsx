import React, { useMemo } from "react";
import { View } from "react-native";

import { Checkbox } from "expo-checkbox";
import { useFormContext } from "react-hook-form";

import { NumberInput } from "@/components/form/NumberInput";
import { ThemedText } from "@/components/themed-text";
import { secondaryColor, whiteColor } from "@/constants/theme";
import { TUpdateCaregiverServices } from "@/features/profile/validations";
import { useCaregiverCaregiver } from "@/hooks/caregiver/use-caregiver-caregiver";
import { TServiceType } from "@/types";

export const ServicesForm = () => {
  const { serviceTypes } = useCaregiverCaregiver();

  const serviceMapper = useMemo(() => {
    const mapper: Record<number, TServiceType> = {};
    serviceTypes.forEach((type) => (mapper[type.id] = type));
    return mapper;
  }, [serviceTypes]);

  const form = useFormContext<TUpdateCaregiverServices>();

  const services = form.watch("services");

  const labelMapper: Record<string, string> = {
    pricePerHour: "Price per hour",
    pricePerService: "Price per service",
    pricePerMile: "Price per mile",
  };

  return (
    <View>
      <View style={{ gap: 16 }}>
        {services?.map(({ id, isActive, serviceRate }, i) => {
          const service = serviceMapper[id];

          const handleOnValueChange = (isChecked: boolean) => {
            form.setValue(`services.${i}.isActive`, isChecked);
          };

          return (
            <View
              key={i}
              style={{
                backgroundColor: whiteColor,
                padding: 16,
                borderRadius: 8,
                gap: 8,
              }}
            >
              <View
                key={i}
                style={{
                  flexDirection: "row",
                  gap: 8,
                }}
              >
                <Checkbox
                  value={isActive}
                  onValueChange={handleOnValueChange}
                  color={secondaryColor}
                />
                <ThemedText>{service.display}</ThemedText>
              </View>
              <NumberInput
                name={`services.${i}.serviceRate`}
                placeholder={labelMapper[service.priceType]}
                defaultValue={serviceRate?.toString()}
              />
            </View>
          );
        })}
      </View>
      <ThemedText type="error">
        {form.formState.errors.services?.message?.toString()}
      </ThemedText>
    </View>
  );
};
