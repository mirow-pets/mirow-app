import React, { useMemo } from "react";
import { View } from "react-native";

import { useFormContext } from "react-hook-form";
import { Checkbox, HelperText } from "react-native-paper";

import { NumberInput } from "@/components/form/NumberInput";
import { ThemedText } from "@/components/themed-text";
import { whiteColor } from "@/constants/theme";
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
      <View>
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
                  alignItems: "center",
                }}
              >
                <Checkbox
                  status={isActive ? "checked" : "unchecked"}
                  onPress={() => handleOnValueChange(!isActive)}
                />
                <ThemedText>{service.display}</ThemedText>
              </View>
              {isActive && (
                <NumberInput
                  label={labelMapper[service.priceType]}
                  name={`services.${i}.serviceRate`}
                  placeholder={labelMapper[service.priceType]}
                  defaultValue={serviceRate?.toString()}
                />
              )}
            </View>
          );
        })}
      </View>
      <HelperText type="error">
        {form.formState.errors.services?.message?.toString()}
      </HelperText>
    </View>
  );
};
