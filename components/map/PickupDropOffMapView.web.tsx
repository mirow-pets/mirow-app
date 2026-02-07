import { useMemo } from "react";

import { MapView } from "@/components/map/MapView";

import type { PickupDropOffMapViewProps } from "./PickupDropOffMapView.types";

const PICKUP_HEIGHT = 280;

export function PickupDropOffMapView({
  pickup,
  dropOff,
  onMapPress,
  style,
}: PickupDropOffMapViewProps) {
  const markers = useMemo(() => {
    const list: {
      id: string;
      lat: number;
      lng: number;
      title: string;
      pinColor: string;
    }[] = [];
    if (pickup?.lat != null && pickup?.lng != null) {
      list.push({
        id: "pickup",
        lat: pickup.lat,
        lng: pickup.lng,
        title: "Pick up",
        pinColor: "green",
      });
    }
    if (dropOff?.lat != null && dropOff?.lng != null) {
      list.push({
        id: "dropOff",
        lat: dropOff.lat,
        lng: dropOff.lng,
        title: "Drop off",
        pinColor: "red",
      });
    }
    return list;
  }, [pickup?.lat, pickup?.lng, dropOff?.lat, dropOff?.lng]);

  return (
    <MapView
      style={style}
      height={PICKUP_HEIGHT}
      markers={markers}
      onMapPress={onMapPress}
    />
  );
}
