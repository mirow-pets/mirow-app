import type { StyleProp, ViewStyle } from "react-native";

export interface LocationPin {
  lat: number;
  lng: number;
  addressText?: string;
}

export interface PickupDropOffMapViewProps {
  pickup?: LocationPin | null;
  dropOff?: LocationPin | null;
  /** Optional: when user taps on the map (lat, lng) */
  onMapPress?: (_lat: number, _lng: number) => void;
  style?: StyleProp<ViewStyle>;
}
