import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Platform } from "react-native";

import { useMutation } from "@tanstack/react-query";
import * as Location from "expo-location";
import Toast from "react-native-toast-message";

import { TSendLocation } from "@/features/auth/validations";
import { Patch } from "@/services/http-service";
import { authStore } from "@/stores/auth.store";
import { onError } from "@/utils";

import { useAuth } from "./use-auth";

// Explanation:
// The error "[Error: Current location is unavailable. Make sure that location services are enabled]"
// usually occurs if the OS location services (such as Location or GPS) are OFF/disabled on the device.
// On Android, it's critical to check if GPS/network is enabled before requesting the current position.
// On iOS, if permissions are granted, it's generally okay—but background restrictions or privacy settings can still block it.
//
// Additionally, sometimes requesting a location too quickly after enabling, or missing required permissions, or running on an emulator without proper location simulation can cause this error.

export interface LocationContextValues {
  lat?: number;
  lng?: number;
}

export const LocationContext = createContext<LocationContextValues | undefined>(
  undefined
);

export interface LocationProviderProps {
  children: ReactNode;
}

// Check if Location Services (GPS/network) are enabled—particularly important on Android.
async function checkLocationServicesEnabled(): Promise<boolean> {
  if (Platform.OS === "android") {
    try {
      const providers = await Location.getProviderStatusAsync();
      // Must have at least one available (GPS or Network)
      return (
        providers?.gpsAvailable === true || providers?.networkAvailable === true
      );
    } catch (error) {
      // Could not check provider status (often due to permission issues)
      return false;
    }
  }
  // iOS: if permission granted, assumed enabled
  return true;
}

const LocationProvider = ({ children }: LocationProviderProps) => {
  const { token } = useAuth();
  const { mutate: sendLocation } = useMutation({
    mutationFn: (input: TSendLocation) => Patch(`/users/location`, input),
    onError,
  });
  const [coords, setCoords] = useState<
    { lat: number; lng: number } | undefined
  >();

  useEffect(() => {
    const getCurrentLocation = async () => {
      // 1. Request location permissions.
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Toast.show({
          type: "error",
          text1: "Permission to access location was denied",
        });
        return;
      }

      // 2. Check if the OS location services (GPS/network) are ON/enabled.
      const locationServicesEnabled = await checkLocationServicesEnabled();
      if (!locationServicesEnabled) {
        Toast.show({
          type: "error",
          text1: "Location services (GPS) are disabled",
          text2:
            Platform.OS === "android"
              ? "Please turn on your device's GPS or enable Location in system settings."
              : "Please enable Location Services in your device settings.",
        });
        return;
      }

      // 3. Attempt to acquire the current position.
      // Use options to potentially help: enableHighAccuracy and a timeout.
      try {
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        if (loc) {
          const { latitude, longitude } = loc.coords;

          setCoords({ lat: latitude, lng: longitude });

          const token = await authStore.getState().token;

          if (token)
            sendLocation({
              lat: latitude.toString(),
              lng: longitude.toString(),
            });
        } else {
          Toast.show({
            type: "error",
            text1: "Location unavailable",
            text2:
              "Could not fetch your current location. Please try again in an open area or check your device settings.",
          });
        }
      } catch (err: any) {
        // For better error diagnosis, surface more details
        console.error("[Location Error]", err);
        if (
          err?.message?.includes("unavailable") ||
          err?.code === "E_LOCATION_UNAVAILABLE"
        ) {
          Toast.show({
            type: "error",
            text1: "Current location is unavailable",
            text2:
              "Make sure that location services are enabled on your device and try again.",
          });
        } else if (
          err?.code === "E_TIMEOUT" ||
          err?.message?.toLowerCase().includes("timeout")
        ) {
          Toast.show({
            type: "error",
            text1: "Location request timed out",
            text2:
              "Unable to retrieve your location in time. Try again in an area with better signal.",
          });
        } else {
          Toast.show({
            type: "error",
            text1: "Failed to get current location",
            text2: "Please try again.",
          });
        }
      }
    };

    getCurrentLocation();
  }, [token, sendLocation]);

  return (
    <LocationContext.Provider value={coords ?? {}}>
      {children}
    </LocationContext.Provider>
  );
};

export default LocationProvider;

export const useLocation = () => {
  const location = useContext(LocationContext);

  if (!location) {
    throw new Error("Cannot access useLocation outside LocationProvider");
  }
  return location;
};
