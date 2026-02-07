import { MapView } from "@/components/map/MapView";

import type { ServiceAreaMapProps } from "./ServiceAreaMap.types";

const MILES_TO_METERS = 1609.34;
const DEFAULT_LAT = 39.8283;
const DEFAULT_LNG = -98.5795;

export function ServiceAreaMap({
  latitude,
  longitude,
  radiusMiles,
  onLocationChange,
  style,
}: ServiceAreaMapProps) {
  const lat = latitude ?? DEFAULT_LAT;
  const lng = longitude ?? DEFAULT_LNG;
  const radiusMeters = radiusMiles * MILES_TO_METERS;

  return (
    <MapView
      style={style}
      height={300}
      initialCenter={{ lat, lng }}
      circle={{
        lat,
        lng,
        radiusMeters,
      }}
      draggableCenter
      onLocationChange={onLocationChange}
    />
  );
}
