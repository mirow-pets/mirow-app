import { useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";

import { ENV } from "@/env";

import type { MapViewProps } from "./MapView.types";

const DEFAULT_LAT = 26.5;
const DEFAULT_LNG = -81.9;
const DEFAULT_HEIGHT = 300;

const PIN_COLOR_ICONS: Record<string, string> = {
  green: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
  red: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
  blue: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
};

function getMarkerIcon(_pinColor?: string): string | undefined {
  if (!_pinColor) return undefined;
  return PIN_COLOR_ICONS[_pinColor] ?? _pinColor;
}

interface GoogleMap {
  setCenter(_center: { lat: number; lng: number }): void;
  setZoom(_zoom: number): void;
  panTo(_center: { lat: number; lng: number }): void;
  fitBounds(_bounds: {
    getNorthEast: () => { lat: () => number; lng: () => number };
    getSouthWest: () => { lat: () => number; lng: () => number };
  }): void;
  addListener(
    _event: string,
    _fn: (_e: { latLng: { lat: () => number; lng: () => number } }) => void
  ): void;
}
interface GoogleMarker {
  setPosition(_position: { lat: number; lng: number }): void;
  setMap(_map: GoogleMap | null): void;
  getPosition(): { lat: () => number; lng: () => number } | null;
  addListener(_event: string, _fn: () => void): void;
}
interface GoogleCircle {
  setCenter(_center: { lat: number; lng: number }): void;
  setRadius(_radius: number): void;
  setMap(_map: GoogleMap | null): void;
}
interface GoogleMaps {
  Map: new (_el: HTMLElement, _opts: object) => GoogleMap;
  Marker: new (_opts: object) => GoogleMarker;
  Circle: new (_opts: object) => GoogleCircle;
  LatLngBounds: new () => {
    extend(_point: { lat: number; lng: number }): void;
    isEmpty: () => boolean;
    getNorthEast: () => { lat: () => number; lng: () => number };
    getSouthWest: () => { lat: () => number; lng: () => number };
  };
}
declare global {
  interface Window {
    google?: { maps: GoogleMaps };
    __genericMapInit?: () => void;
  }
}

export function MapView({
  initialCenter,
  zoom = 10,
  markers = [],
  circle,
  draggableCenter,
  onMapPress,
  onLocationChange,
  style,
  height = DEFAULT_HEIGHT,
}: MapViewProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<GoogleMap | null>(null);
  const markersRef = useRef<Record<string, GoogleMarker>>({});
  const circleRef = useRef<GoogleCircle | null>(null);
  const centerMarkerRef = useRef<GoogleMarker | null>(null);
  const [mapsReady, setMapsReady] = useState(false);
  const center = useMemo(
    () => initialCenter ?? { lat: DEFAULT_LAT, lng: DEFAULT_LNG },
    [initialCenter]
  );
  const zoomLevel =
    zoom != null && zoom >= 0 && zoom <= 22 ? Math.round(zoom) : 10;

  useEffect(() => {
    if (typeof window === "undefined" || window.google?.maps) {
      setMapsReady(true);
      return;
    }
    const _existing = document.querySelector(
      'script[src*="maps.googleapis.com"]'
    );
    if (_existing) {
      if (window.google?.maps) setMapsReady(true);
      else window.__genericMapInit = () => setMapsReady(true);
      return;
    }
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${ENV.GOOGLE_MAPS_API_KEY}&callback=__genericMapInit`;
    script.async = true;
    script.defer = true;
    window.__genericMapInit = () => setMapsReady(true);
    script.onload = () => {
      if (window.google?.maps) setMapsReady(true);
    };
    document.head.appendChild(script);
    return () => {
      delete window.__genericMapInit;
    };
  }, []);

  useEffect(() => {
    if (!mapsReady || !containerRef.current || !window.google?.maps) return;

    const { Map } = window.google.maps;
    const map = new Map(containerRef.current, {
      zoom: zoomLevel,
      center,
      mapTypeId: "roadmap",
      streetViewControl: false,
      mapTypeControl: true,
      fullscreenControl: true,
      zoomControl: true,
      gestureHandling: "auto",
    });

    if (onMapPress) {
      map.addListener(
        "click",
        (e: { latLng: { lat: () => number; lng: () => number } }) => {
          onMapPress(e.latLng.lat(), e.latLng.lng());
        }
      );
    }

    mapRef.current = map;

    return () => {
      Object.values(markersRef.current).forEach((_m) => _m.setMap(null));
      markersRef.current = {};
      circleRef.current?.setMap(null);
      circleRef.current = null;
      centerMarkerRef.current?.setMap(null);
      centerMarkerRef.current = null;
      mapRef.current = null;
    };
  }, [mapsReady]); // eslint-disable-line react-hooks/exhaustive-deps -- init once

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !window.google?.maps) return;

    const { Marker, Circle, LatLngBounds } = window.google.maps;
    const currentIds = new Set(markers.map((m) => m.id));

    markers.forEach((m) => {
      const pos = { lat: m.lat, lng: m.lng };
      let marker = markersRef.current[m.id];
      if (!marker) {
        marker = new Marker({
          position: pos,
          map,
          title: m.title ?? "",
          icon: getMarkerIcon(m.pinColor),
        });
        markersRef.current[m.id] = marker;
      } else {
        marker.setPosition(pos);
        marker.setMap(map);
      }
    });
    Object.keys(markersRef.current).forEach((_id) => {
      if (!currentIds.has(_id)) {
        markersRef.current[_id].setMap(null);
        delete markersRef.current[_id];
      }
    });

    if (circle != null) {
      const centerPos = { lat: circle.lat, lng: circle.lng };
      if (!circleRef.current) {
        circleRef.current = new Circle({
          strokeColor: "#37b2ff",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "#37b2ff",
          fillOpacity: 0.2,
          map,
          center: centerPos,
          radius: circle.radiusMeters,
        });
      } else {
        circleRef.current.setCenter(centerPos);
        circleRef.current.setRadius(circle.radiusMeters);
        circleRef.current.setMap(map);
      }

      if (draggableCenter) {
        let centerMarker = centerMarkerRef.current;
        if (!centerMarker) {
          centerMarker = new Marker({
            position: centerPos,
            map,
            draggable: true,
            title: "Your Location",
          });
          centerMarker.addListener("dragend", () => {
            const pos = centerMarker!.getPosition();
            if (pos) {
              onLocationChange?.(pos.lat(), pos.lng());
              circleRef.current?.setCenter({
                lat: pos.lat(),
                lng: pos.lng(),
              });
            }
          });
          centerMarkerRef.current = centerMarker;
        } else {
          centerMarker.setPosition(centerPos);
          centerMarker.setMap(map);
        }
      } else {
        centerMarkerRef.current?.setMap(null);
      }
    } else {
      circleRef.current?.setMap(null);
      centerMarkerRef.current?.setMap(null);
    }

    if (markers.length >= 2) {
      const bounds = new LatLngBounds();
      markers.forEach((_m) => bounds.extend({ lat: _m.lat, lng: _m.lng }));
      if (!bounds.isEmpty()) map.fitBounds(bounds);
    } else if (markers.length === 1) {
      map.setCenter({ lat: markers[0].lat, lng: markers[0].lng });
    } else if (circle != null) {
      map.setCenter({ lat: circle.lat, lng: circle.lng });
    } else {
      map.setCenter(center);
      map.setZoom(zoomLevel);
    }
  }, [
    center,
    markers,
    circle,
    draggableCenter,
    onLocationChange,
    center.lat,
    center.lng,
    zoomLevel,
  ]);

  return (
    <View style={[styles.container, { height }, style]}>
      <div ref={containerRef} style={{ ...styles.mapDiv, minHeight: height }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  mapDiv: {
    width: "100%",
    height: "100%",
  },
});
