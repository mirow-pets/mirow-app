import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { Entypo } from "@expo/vector-icons";
import { FormProvider, useForm } from "react-hook-form";
import { Checkbox, IconButton } from "react-native-paper";

import { DropdownInput } from "@/components/form/DropdownInput";
import { SliderInput } from "@/components/form/SliderInput";
import { Modal } from "@/components/modal/Modal";
import { ThemedText } from "@/components/themed-text";
import { primaryColor } from "@/constants/theme";
import { usePetOwnerProfile } from "@/hooks/pet-owner/use-pet-owner-profile";
import { useModal } from "@/hooks/use-modal";
import { TCaregiversFilter } from "@/types/caregivers";

import { CaregiversFilterCollapsible } from "./CaregiversFilterCollapsible";

export const CaregiversFilterModal = ({
  petName,
  disabledFields,
  filter,
  onChange,
}: {
  petName?: string;
  disabledFields?: (keyof TCaregiversFilter)[];
  filter: TCaregiversFilter;
  onChange: (_filter: TCaregiversFilter) => void;
}) => {
  const {
    serviceTypeOptions,
    petTypeOptions,
    homeTypeOptions,
    transportationTypeOptions,
    caregiverPreferenceOptions,
    caregiverSkillOptions,
  } = usePetOwnerProfile();
  const { setOpenId } = useModal();

  // UseForm with defaultValues.
  const form = useForm<TCaregiversFilter>({
    defaultValues: filter,
  });

  const values = form.watch();

  /**
   * Resets the form to its *initial* default values (from props.filter),
   * as typical in "reset filter" pattern.
   */
  const reset = () => {
    form.setValue("price", 0);
    form.setValue(
      "radius",
      disabledFields?.includes("radius") ? filter.radius : 0
    );
    form.setValue("starrating", 0);
    form.setValue(
      "serviceTypeIds",
      disabledFields?.includes("serviceTypeIds")
        ? filter.serviceTypeIds
        : undefined
    );
    form.setValue(
      "petTypeIds",
      disabledFields?.includes("petTypeIds") ? filter.petTypeIds : undefined
    );
    form.setValue("caregiverPreferenceIds", undefined);
    form.setValue("caregiverSkillIds", undefined);
    form.setValue("transportTypeIds", undefined);
    form.setValue("homeTypeIds", undefined);
  };

  const cancel = () => {
    form.reset();
    setOpenId("");
  };

  const apply = () => {
    onChange(form.getValues());
    setOpenId("");
  };

  const selectedServiceType = serviceTypeOptions.find(
    (option) => option.value === values.serviceTypeIds?.[0]
  );
  const selectedPetType = petTypeOptions.find(
    (option) => option.value === values.petTypeIds?.[0]
  );

  return (
    <Modal
      id="caregivers-filter"
      title="Caregivers Filter"
      trigger={<IconButton icon="filter-outline" />}
      style={{ width: "90%", maxWidth: 480, minHeight: 500 }}
      onConfirm={apply}
      onCancel={cancel}
      confirmText="Apply"
      actions={
        <TouchableOpacity onPress={reset}>
          <ThemedText>Reset</ThemedText>
        </TouchableOpacity>
      }
    >
      <FormProvider {...form}>
        <View style={styles.container}>
          {disabledFields?.includes("serviceTypeIds") ? (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <ThemedText>Service type: </ThemedText>
              <ThemedText type="subtitle">
                {selectedServiceType?.label}
              </ThemedText>
            </View>
          ) : (
            <DropdownInput
              name="serviceTypeIds"
              options={serviceTypeOptions}
              placeholder="Service type"
              value={values.serviceTypeIds?.[0]}
              onChange={(value) =>
                form.setValue("serviceTypeIds", [Number(value)])
              }
            />
          )}
          {petName && (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <ThemedText>Pet name: </ThemedText>
              <ThemedText type="subtitle">{petName}</ThemedText>
            </View>
          )}
          {disabledFields?.includes("petTypeIds") ? (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <ThemedText>Pet type: </ThemedText>
              <ThemedText type="subtitle">{selectedPetType?.label}</ThemedText>
            </View>
          ) : (
            <DropdownInput
              name="petTypeIds"
              options={petTypeOptions}
              placeholder="Pet type"
              value={values.petTypeIds?.[0]}
              onChange={(value) => form.setValue("petTypeIds", [Number(value)])}
            />
          )}

          <SliderInput
            label="Price range"
            actions={
              <ThemedText style={{ fontSize: 12 }}>
                (Max) ${values.price || 0} / $100
              </ThemedText>
            }
            name="price"
            minimumValue={0}
            maximumValue={100}
            step={1}
          />

          {disabledFields?.includes("radius") ? (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <ThemedText>Radius: </ThemedText>
              <ThemedText type="subtitle">{values.radius || 0} mi</ThemedText>
            </View>
          ) : (
            <SliderInput
              label="Radius"
              name="radius"
              actions={
                <ThemedText style={{ fontSize: 12 }}>
                  (Max) {values.radius || 0} / 20 mi
                </ThemedText>
              }
              minimumValue={0}
              maximumValue={20}
              step={1}
            />
          )}

          <SliderInput
            label="Ratings"
            name="starrating"
            actions={
              <ThemedText style={{ fontSize: 12 }}>
                <Entypo
                  name="star"
                  size={16}
                  style={{ marginHorizontal: 4 }}
                  color={"#f4c430"}
                />{" "}
                {values.starrating || 0} / 5
              </ThemedText>
            }
            minimumValue={0}
            maximumValue={5}
            step={1}
          />

          <CaregiversFilterCollapsible title="Home Types">
            {homeTypeOptions.map((item, i) => {
              const value = item.value as number;

              const handleChange = (active: boolean) => {
                const homeTypeIds = active
                  ? [...(values.homeTypeIds ?? []), value]
                  : values.homeTypeIds?.filter((id) => id !== value);

                form.setValue("homeTypeIds", homeTypeIds);
              };

              const isChecked = values.homeTypeIds?.includes(value);

              return (
                <View
                  key={i}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                    paddingVertical: 4,
                  }}
                >
                  <View style={{ flex: 1, minWidth: 0, marginRight: 8 }}>
                    <ThemedText>{item.label}</ThemedText>
                  </View>
                  <Checkbox
                    status={isChecked ? "checked" : "unchecked"}
                    onPress={() => handleChange(!isChecked)}
                  />
                </View>
              );
            })}
          </CaregiversFilterCollapsible>

          <CaregiversFilterCollapsible title="Transportation Types">
            {transportationTypeOptions.map((item, i) => {
              const value = item.value as number;

              const handleChange = (active: boolean) => {
                const transportTypeIds = active
                  ? [...(values.transportTypeIds ?? []), value]
                  : values.transportTypeIds?.filter((id) => id !== value);

                form.setValue("transportTypeIds", transportTypeIds);
              };

              const isChecked = values.transportTypeIds?.includes(value);

              return (
                <View
                  key={i}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                    paddingVertical: 4,
                  }}
                >
                  <View style={{ flex: 1, minWidth: 0, marginRight: 8 }}>
                    <ThemedText>{item.label}</ThemedText>
                  </View>
                  <Checkbox
                    status={isChecked ? "checked" : "unchecked"}
                    onPress={() => handleChange(!isChecked)}
                    color={primaryColor}
                  />
                </View>
              );
            })}
          </CaregiversFilterCollapsible>

          <CaregiversFilterCollapsible title="Caregiver Preferences">
            {caregiverPreferenceOptions.map((item, i) => {
              const value = item.value as number;

              const handleChange = (active: boolean) => {
                const caregiverPreferenceIds = active
                  ? [...(values.caregiverPreferenceIds ?? []), value]
                  : values.caregiverPreferenceIds?.filter((id) => id !== value);

                form.setValue("caregiverPreferenceIds", caregiverPreferenceIds);
              };

              const isChecked = values.caregiverPreferenceIds?.includes(value);

              return (
                <View
                  key={i}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                    paddingVertical: 4,
                  }}
                >
                  <View style={{ flex: 1, minWidth: 0, marginRight: 8 }}>
                    <ThemedText>{item.label}</ThemedText>
                  </View>
                  <Checkbox
                    status={isChecked ? "checked" : "unchecked"}
                    onPress={() => handleChange(!isChecked)}
                    color={primaryColor}
                  />
                </View>
              );
            })}
          </CaregiversFilterCollapsible>

          <CaregiversFilterCollapsible title="Unique Skills">
            {caregiverSkillOptions.map((item, i) => {
              const value = item.value as number;

              const handleChange = (active: boolean) => {
                const caregiverSkillIds = active
                  ? [...(values.caregiverSkillIds ?? []), value]
                  : values.caregiverSkillIds?.filter((id) => id !== value);

                form.setValue("caregiverSkillIds", caregiverSkillIds);
              };

              const isChecked = values.caregiverSkillIds?.includes(value);

              return (
                <View
                  key={i}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                    paddingVertical: 4,
                  }}
                >
                  <View style={{ flex: 1, minWidth: 0, marginRight: 8 }}>
                    <ThemedText numberOfLines={1} ellipsizeMode="tail">
                      {item.label}
                    </ThemedText>
                  </View>
                  <View style={{ flexShrink: 0 }}>
                    <Checkbox
                      status={isChecked ? "checked" : "unchecked"}
                      onPress={() => handleChange(!isChecked)}
                      color={primaryColor}
                    />
                  </View>
                </View>
              );
            })}
          </CaregiversFilterCollapsible>
        </View>
      </FormProvider>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    gap: 16,
  },
});
