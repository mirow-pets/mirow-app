import type { StyleProp, ViewStyle } from "react-native";

export interface ServiceAreaMapProps {
  latitude: number;
  longitude: number;
  radiusMiles: number;
  // eslint-disable-next-line no-unused-vars -- callback param names are for API clarity
  onLocationChange?: (latitude: number, longitude: number) => void;
  style?: StyleProp<ViewStyle>;
}
