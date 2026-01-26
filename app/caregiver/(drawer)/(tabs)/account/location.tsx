import { useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { FormProvider, useForm } from "react-hook-form";
import Toast from "react-native-toast-message";
import { WebView } from "react-native-webview";
import { z } from "zod";

import { Button } from "@/components/button/Button";
import { SliderInput } from "@/components/form/SliderInput";
import { ThemedText } from "@/components/themed-text";
import { whiteColor } from "@/constants/theme";
import { ENV } from "@/env";
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

export default function LocationScreen() {
  const router = useRouter();
  const { profile } = useCaregiverProfile();
  const { lat: currentLat, lng: currentLng } = useLocation();
  const { refetch } = useRefetchQueries();
  const webViewRef = useRef<WebView>(null);
  const [mapLat, setMapLat] = useState<number | undefined>(currentLat);
  const [mapLng, setMapLng] = useState<number | undefined>(currentLng);

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

  // Generate Google Maps HTML with marker and circle, disabling street view
  const generateMapHTML = (lat: number, lng: number, radiusMiles: number) => {
    const radiusMeters = radiusMiles * 1609.34; // Convert miles to meters

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { margin: 0; padding: 0; }
            #map { height: 100vh; width: 100%; }
          </style>
        </head>
        <body>
          <div id="map"></div>
          <script>
            function initMap() {
              const center = { lat: ${lat}, lng: ${lng} };
              const map = new google.maps.Map(document.getElementById('map'), {
                zoom: 10,
                center: center,
                mapTypeId: 'roadmap',
                streetViewControl: false,         // Disable the Street View Pegman control
                streetView: false,                // Additional attempt to disable street view
                mapTypeControl: true,
                fullscreenControl: true,
                zoomControl: true,
                gestureHandling: "auto"
              });

              // Remove street view by explicitly disabling service and control
              map.setOptions({ streetViewControl: false });

              // Add marker
              const marker = new google.maps.Marker({
                position: center,
                map: map,
                draggable: true,
                title: 'Your Location'
              });

              // Add circle for radius
              const circle = new google.maps.Circle({
                strokeColor: '#37b2ff',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#37b2ff',
                fillOpacity: 0.2,
                map: map,
                center: center,
                radius: ${radiusMeters}
              });

              // Update location when marker is dragged
              marker.addListener('dragend', function(event) {
                const newLat = event.latLng.lat();
                const newLng = event.latLng.lng();
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  type: 'location',
                  lat: newLat,
                  lng: newLng
                }));
              });

              // Update circle when radius changes
              window.updateRadius = function(newRadiusMiles) {
                const newRadiusMeters = newRadiusMiles * 1609.34;
                circle.setRadius(newRadiusMeters);
              };
            }
          </script>
          <script async defer
            src="https://maps.googleapis.com/maps/api/js?key=${ENV.GOOGLE_MAPS_API_KEY}&callback=initMap">
          </script>
        </body>
      </html>
    `;
  };

  const handleWebViewMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === "location") {
        setMapLat(data.lat);
        setMapLng(data.lng);
        form.setValue("lat", data.lat);
        form.setValue("lng", data.lng);
      }
    } catch (error) {
      console.error("Error parsing WebView message:", error);
    }
  };

  // Update map radius when slider changes
  useEffect(() => {
    if (webViewRef.current && mapLat && mapLng && radius) {
      const timer = setTimeout(() => {
        webViewRef.current?.injectJavaScript(`
          if (window.updateRadius) {
            window.updateRadius(${radius});
          }
        `);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [radius, mapLat, mapLng]);

  const displayLat = mapLat || currentLat || 0;
  const displayLng = mapLng || currentLng || 0;

  return (
    <FormProvider {...form}>
      <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <ThemedText style={styles.title}>Set Your Service Area</ThemedText>
          <ThemedText style={styles.description}>
            Drag the marker to set your location and adjust the radius to define
            your service area.
          </ThemedText>

          {displayLat && displayLng ? (
            <View style={styles.mapContainer}>
              <WebView
                ref={webViewRef}
                source={{
                  html: generateMapHTML(displayLat, displayLng, radius),
                }}
                style={styles.map}
                onMessage={handleWebViewMessage}
                javaScriptEnabled={true}
                domStorageEnabled={true}
              />
            </View>
          ) : (
            <View style={styles.mapPlaceholder}>
              <ThemedText>Loading map...</ThemedText>
            </View>
          )}

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

          <Button onPress={handleSubmit} loading={isPending} color="secondary">
            Save Location & Radius
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
    height: 300,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  map: {
    flex: 1,
  },
  mapPlaceholder: {
    height: 300,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
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
