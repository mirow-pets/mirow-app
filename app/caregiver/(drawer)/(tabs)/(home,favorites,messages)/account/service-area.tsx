import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { FormProvider, useForm } from "react-hook-form";
import Toast from "react-native-toast-message";
import { z } from "zod";

import { Button } from "@/components/button/Button";
import { SliderInput } from "@/components/form/SliderInput";
import { ServiceAreaMap } from "@/components/map/ServiceAreaMap";
import { ThemedText } from "@/components/themed-text";
import { whiteColor } from "@/constants/theme";
import { useCaregiverProfile } from "@/hooks/caregiver/use-caregiver-profile";
import { useExitFormRouteWarning } from "@/hooks/use-exit-form-route";
import { useLocation } from "@/hooks/use-location";
import { useRefetchQueries } from "@/hooks/use-refetch-queries";
import { Patch } from "@/services/http-service";
import { onError } from "@/utils";

const locationSchema = z.object({
  acceptanceRadius: z.number().min(1, "Radius must be at least 1 mile"),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

type TLocationForm = z.infer<typeof locationSchema>;

export default function ServiceAreaScreen() {
  const router = useRouter();
  const { profile } = useCaregiverProfile();
  const { lat: currentLat, lng: currentLng } = useLocation();
  const { refetch } = useRefetchQueries();
  const [mapLat, setMapLat] = useState<number | undefined>(
    profile?.lat ?? currentLat
  );
  const [mapLng, setMapLng] = useState<number | undefined>(
    profile?.lng ?? currentLng
  );

  const form = useForm<TLocationForm>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      acceptanceRadius: profile?.acceptanceRadius ?? 5,
      lat: profile?.lat ?? mapLat,
      lng: profile?.lng ?? mapLng,
    },
  });

  const radius = form.watch("acceptanceRadius");

  const { mutate, isPending } = useMutation<void, Error, TLocationForm>({
    mutationFn: (input) => Patch("/care-givers", input),
    onSuccess: () => {
      refetch([["caregiver-profile"], ["caregiver-profile-completion"]]);
      form.reset();
      router.replace("/caregiver/account");

      Toast.show({
        type: "success",
        text1: "Location and radius updated successfully!",
      });
    },
    onError,
  });

  useExitFormRouteWarning({
    isDirty: form.formState.isDirty,
    onExit: () => {
      form.reset();
    },
  });

  const handleSubmit = async () => {
    const result = await form.trigger("acceptanceRadius");
    if (!result) return;

    mutate({
      ...form.getValues(),
      lat: mapLat,
      lng: mapLng,
    });
  };

  const handleLocationChange = (lat: number, lng: number) => {
    setMapLat(lat);
    setMapLng(lng);
    form.setValue("lat", lat);
    form.setValue("lng", lng);
  };

  const displayLat = mapLat ?? currentLat ?? 0;
  const displayLng = mapLng ?? currentLng ?? 0;

  return (
    <FormProvider {...form}>
      <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <ThemedText style={styles.title}>Set Your Service Area</ThemedText>
          <ThemedText style={styles.description}>
            Drag the marker to set your location and adjust the radius to define
            your service area.
          </ThemedText>

          <View style={styles.mapContainer}>
            <ServiceAreaMap
              latitude={displayLat}
              longitude={displayLng}
              radiusMiles={radius}
              onLocationChange={handleLocationChange}
              style={styles.map}
            />
          </View>

          <View style={styles.infoContainer}>
            <ThemedText style={styles.infoText}>
              Location: {displayLat.toFixed(4)}, {displayLng.toFixed(4)}
            </ThemedText>
          </View>

          <SliderInput
            label="Acceptance Radius"
            name="acceptanceRadius"
            minimumValue={1}
            maximumValue={50}
            step={1}
            actions={
              <ThemedText style={styles.radiusValue}>
                {radius} {radius === 1 ? "mile" : "miles"}
              </ThemedText>
            }
          />

          <Button onPress={handleSubmit} loading={isPending}>
            Save Location
          </Button>
        </View>
      </ScrollView>
    </FormProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingBottom: 100,
    gap: 16,
    backgroundColor: whiteColor,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  mapContainer: {
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  map: {
    height: 300,
  },
  infoContainer: {
    padding: 12,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
  infoText: {
    fontSize: 12,
    color: "#666",
  },
  radiusValue: {
    fontSize: 14,
    fontWeight: "600",
  },
});
