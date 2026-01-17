import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { Entypo } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import { router } from "expo-router";
import { FormProvider, useForm } from "react-hook-form";

import { Button } from "@/components/button/Button";
import { DropdownInput } from "@/components/form/DropdownInput";
import { SliderInput } from "@/components/form/SliderInput";
import { ScrollViewWithRefresh } from "@/components/layout/ScrollViewWithRefresh";
import { ThemedText } from "@/components/themed-text";
import { primaryColor } from "@/constants/theme";
import {
  CaregiversFilter,
  usePetOwnerCaregiverFilter,
} from "@/hooks/pet-owner/use-pet-owner-caregivers-filter";
import { usePetOwnerProfile } from "@/hooks/pet-owner/use-pet-owner-profile";

type CollapsibleProps = {
  title: string;
  children: React.ReactNode;
  initiallyOpen?: boolean;
};

const Collapsible = ({
  title,
  children,
  initiallyOpen = false,
}: CollapsibleProps) => {
  const [open, setOpen] = useState(initiallyOpen);

  return (
    <View style={collapsibleStyles.container}>
      <TouchableOpacity
        activeOpacity={0.7}
        style={collapsibleStyles.header}
        onPress={() => setOpen((o) => !o)}
      >
        <ThemedText style={collapsibleStyles.title}>{title}</ThemedText>
        <Entypo
          name={open ? "chevron-up" : "chevron-down"}
          size={20}
          color="#1E90FF"
        />
      </TouchableOpacity>
      {open ? <View style={collapsibleStyles.content}>{children}</View> : null}
    </View>
  );
};

const collapsibleStyles = StyleSheet.create({
  container: {
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: "#F7F9FB",
    overflow: "hidden",
  },
  header: {
    padding: 8,
    paddingRight: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#e0e0e0",
  },
  title: {
    fontWeight: "600",
    fontSize: 16,
    color: "#333",
  },
  content: {
    padding: 14,
    paddingTop: 6,
  },
});

export default function CaregiversFilterScreen() {
  const { filter, setFilter } = usePetOwnerCaregiverFilter();

  const {
    serviceTypeOptions,
    petTypeOptions,
    homeTypeOptions,
    transportationTypeOptions,
    caregiverPreferenceOptions,
    caregiverSkillOptions,
  } = usePetOwnerProfile();

  const form = useForm<CaregiversFilter>({
    defaultValues: filter,
  });

  const values = form.watch();

  const apply = (input: CaregiversFilter) => {
    setFilter(input);
    router.back();
  };

  return (
    <FormProvider {...form}>
      <ScrollViewWithRefresh>
        <View style={styles.container}>
          <DropdownInput
            name="serviceTypeIds"
            options={serviceTypeOptions}
            placeholder="Service type"
            value={values.serviceTypeIds?.[0]}
            onChange={(value) =>
              form.setValue("serviceTypeIds", [value as number])
            }
            disabled
          />

          <DropdownInput
            name="petTypeIds"
            options={petTypeOptions}
            placeholder="Pet type"
            value={values.petTypeIds?.[0]}
            onChange={(value) => form.setValue("petTypeIds", [value as number])}
            disabled
          />

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

          <SliderInput
            label="Radius"
            name="radius"
            actions={
              <ThemedText style={{ fontSize: 12 }}>
                (Max) ${values.radius || 0} / 20 mi
              </ThemedText>
            }
            minimumValue={0}
            maximumValue={20}
            step={1}
          />

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

          <Collapsible title="Home Types">
            {homeTypeOptions.map((item, i) => {
              const value = item.value as number;

              const handleChange = (active: boolean) => {
                const homeTypeIds = active
                  ? [...(values.homeTypeIds ?? []), value]
                  : values.homeTypeIds?.filter((id) => id !== value);

                form.setValue("homeTypeIds", homeTypeIds);
              };

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
                    value={values.homeTypeIds?.includes(value)}
                    onValueChange={handleChange}
                    color={primaryColor}
                  />
                </View>
              );
            })}
          </Collapsible>

          <Collapsible title="Transportation Types">
            {transportationTypeOptions.map((item, i) => {
              const value = item.value as number;

              const handleChange = (active: boolean) => {
                const transportTypeIds = active
                  ? [...(values.transportTypeIds ?? []), value]
                  : values.transportTypeIds?.filter((id) => id !== value);

                form.setValue("transportTypeIds", transportTypeIds);
              };

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
                    value={values.transportTypeIds?.includes(value)}
                    onValueChange={handleChange}
                    color={primaryColor}
                  />
                </View>
              );
            })}
          </Collapsible>

          <Collapsible title="Caregiver Preferences">
            {caregiverPreferenceOptions.map((item, i) => {
              const value = item.value as number;

              const handleChange = (active: boolean) => {
                const caregiverPreferenceIds = active
                  ? [...(values.caregiverPreferenceIds ?? []), value]
                  : values.caregiverPreferenceIds?.filter((id) => id !== value);

                form.setValue("caregiverPreferenceIds", caregiverPreferenceIds);
              };

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
                    value={values.caregiverPreferenceIds?.includes(value)}
                    onValueChange={handleChange}
                    color={primaryColor}
                  />
                </View>
              );
            })}
          </Collapsible>

          <Collapsible title="Unique Skills">
            {caregiverSkillOptions.map((item, i) => {
              const value = item.value as number;

              const handleChange = (active: boolean) => {
                const caregiverSkillIds = active
                  ? [...(values.caregiverSkillIds ?? []), value]
                  : values.caregiverSkillIds?.filter((id) => id !== value);

                form.setValue("caregiverSkillIds", caregiverSkillIds);
              };

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
                      value={values.caregiverSkillIds?.includes(value)}
                      onValueChange={handleChange}
                      color={primaryColor}
                    />
                  </View>
                </View>
              );
            })}
          </Collapsible>

          <Button
            title="Apply"
            size="sm"
            color="secondary"
            onPress={form.handleSubmit(apply)}
          />

          <Button
            title="Reset"
            size="sm"
            color="primary"
            variant="reversed"
            onPress={() => form.reset()}
          />
          <View style={{ height: 100 }}></View>
        </View>
      </ScrollViewWithRefresh>
    </FormProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    width: "100%",
    gap: 16,
    backgroundColor: primaryColor,
  },
});
