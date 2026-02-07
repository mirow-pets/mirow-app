import type { StyleProp, ViewStyle } from "react-native";

export interface MapMarkerInput {
  id: string;
  lat: number;
  lng: number;
  title?: string;
  /** 'green' | 'red' | 'blue' or full icon URL */
  pinColor?: string;
}

export interface MapCircleInput {
  lat: number;
  lng: number;
  /** Radius in meters */
  radiusMeters: number;
}

export interface MapViewProps {
  /** Initial map center when no markers/circle */
  initialCenter?: { lat: number; lng: number };
  /** Initial zoom level (default 10) */
  zoom?: number;
  /** Static markers to show (e.g. pickup, drop-off) */
  markers?: MapMarkerInput[];
  /** Optional circle overlay (e.g. service area) */
  circle?: MapCircleInput;
  /** When true, circle center is draggable and onLocationChange is called */
  draggableCenter?: boolean;
  /** Called when user taps on the map */
  onMapPress?: (_lat: number, _lng: number) => void;
  /** Called when user drags the center marker (requires draggableCenter + circle) */
  onLocationChange?: (_lat: number, _lng: number) => void;
  style?: StyleProp<ViewStyle>;
  /** Map height in pixels (default 300) */
  height?: number;
}
