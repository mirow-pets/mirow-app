import { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";

import { ENV } from "@/env";

import type { ServiceAreaMapProps } from "./ServiceAreaMap.types";

const MILES_TO_METERS = 1609.34;

// Minimal types for Google Maps JS API (no @types/google.maps required)
interface GoogleMap {
  setCenter(center: { lat: number; lng: number }): void;
  panTo(center: { lat: number; lng: number }): void;
}
interface GoogleMarker {
  getPosition(): { lat(): number; lng(): number } | null;
  setPosition(position: { lat: number; lng: number }): void;
  addListener(event: string, fn: () => void): void;
}
interface GoogleCircle {
  setCenter(center: { lat: number; lng: number }): void;
  setRadius(radius: number): void;
}
interface GoogleMaps {
  Map: new (el: HTMLElement, opts: object) => GoogleMap;
  Marker: new (opts: object) => GoogleMarker;
  Circle: new (opts: object) => GoogleCircle;
}
declare global {
  interface Window {
    google?: { maps: GoogleMaps };
    __serviceAreaMapInit?: () => void;
  }
}

export function ServiceAreaMap({
  latitude,
  longitude,
  radiusMiles,
  onLocationChange,
  style,
}: ServiceAreaMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<GoogleMap | null>(null);
  const markerRef = useRef<GoogleMarker | null>(null);
  const circleRef = useRef<GoogleCircle | null>(null);
  const [mapsReady, setMapsReady] = useState(false);

  // Load Google Maps script once
  useEffect(() => {
    if (typeof window === "undefined" || window.google?.maps) {
      setMapsReady(true);
      return;
    }
    const existing = document.querySelector(
      'script[src*="maps.googleapis.com"]'
    );
    if (existing) {
      if (window.google?.maps) setMapsReady(true);
      else {
        window.__serviceAreaMapInit = () => setMapsReady(true);
      }
      return;
    }
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${ENV.GOOGLE_MAPS_API_KEY}&callback=__serviceAreaMapInit`;
    script.async = true;
    script.defer = true;
    window.__serviceAreaMapInit = () => setMapsReady(true);
    script.onload = () => {
      if (window.google?.maps) setMapsReady(true);
    };
    document.head.appendChild(script);
    return () => {
      delete window.__serviceAreaMapInit;
    };
  }, []);

  // Init map when container and script are ready
  useEffect(() => {
    if (!mapsReady || !containerRef.current || !window.google?.maps) return;

    const center = { lat: latitude, lng: longitude };
    const { Map, Marker, Circle } = window.google.maps;
    const map = new Map(containerRef.current, {
      zoom: 10,
      center,
      mapTypeId: "roadmap",
      streetViewControl: false,
      mapTypeControl: true,
      fullscreenControl: true,
      zoomControl: true,
      gestureHandling: "auto",
    });

    const marker = new Marker({
      position: center,
      map,
      draggable: true,
      title: "Your Location",
    });

    const radiusMeters = radiusMiles * MILES_TO_METERS;
    const circle = new Circle({
      strokeColor: "#37b2ff",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#37b2ff",
      fillOpacity: 0.2,
      map,
      center,
      radius: radiusMeters,
    });

    marker.addListener("dragend", () => {
      const pos = marker.getPosition();
      if (pos) onLocationChange?.(pos.lat(), pos.lng());
    });

    mapRef.current = map;
    markerRef.current = marker;
    circleRef.current = circle;

    return () => {
      mapRef.current = null;
      markerRef.current = null;
      circleRef.current = null;
    };
  }, [mapsReady]); // eslint-disable-line react-hooks/exhaustive-deps -- only init once when ready

  // Update marker, circle, and pan map when props change
  useEffect(() => {
    const map = mapRef.current;
    const marker = markerRef.current;
    const circle = circleRef.current;
    if (!marker || !circle) return;

    const center = { lat: latitude, lng: longitude };
    marker.setPosition(center);
    circle.setCenter(center);
    circle.setRadius(radiusMiles * MILES_TO_METERS);
    map?.panTo(center);
  }, [latitude, longitude, radiusMiles]);

  return (
    <View style={[styles.container, style]}>
      <div ref={containerRef} style={styles.mapDiv} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 300,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  mapDiv: {
    width: "100%",
    height: "100%",
    minHeight: 300,
  },
});
