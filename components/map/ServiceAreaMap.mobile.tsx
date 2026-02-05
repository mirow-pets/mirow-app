import { useEffect, useMemo, useRef } from "react";
import { StyleSheet, View } from "react-native";

import { WebView } from "react-native-webview";

import { ENV } from "@/env";

import type { ServiceAreaMapProps } from "./ServiceAreaMap.types";

const MILES_TO_METERS = 1609.34;
const DEFAULT_LAT = 39.8283;
const DEFAULT_LNG = -98.5795;

function generateMapHTML(lat: number, lng: number, radiusMiles: number) {
  const radiusMeters = radiusMiles * MILES_TO_METERS;
  return `
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body { margin: 0; padding: 0; }
      #map { height: 100%; width: 100%; min-height: 300px; }
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
          streetViewControl: false,
          mapTypeControl: true,
          fullscreenControl: true,
          zoomControl: true,
          gestureHandling: "auto"
        });
        map.setOptions({ streetViewControl: false });

        const marker = new google.maps.Marker({
          position: center,
          map: map,
          draggable: true,
          title: 'Your Location'
        });

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

        marker.addListener('dragend', function(event) {
          const newLat = event.latLng.lat();
          const newLng = event.latLng.lng();
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'location',
            lat: newLat,
            lng: newLng
          }));
        });

        window.updateRadius = function(newRadiusMiles) {
          circle.setRadius(newRadiusMiles * ${MILES_TO_METERS});
        };
        window.updateCenter = function(lat, lng) {
          const pos = { lat: lat, lng: lng };
          marker.setPosition(pos);
          circle.setCenter(pos);
          map.panTo(pos);
        };
      }
    </script>
    <script async defer
      src="https://maps.googleapis.com/maps/api/js?key=${ENV.GOOGLE_MAPS_API_KEY}&callback=initMap">
    </script>
  </body>
</html>
  `.trim();
}

export function ServiceAreaMap({
  latitude,
  longitude,
  radiusMiles,
  onLocationChange,
  style,
}: ServiceAreaMapProps) {
  const webViewRef = useRef<WebView>(null);
  const lat = latitude ?? DEFAULT_LAT;
  const lng = longitude ?? DEFAULT_LNG;

  // Stable initial HTML so the WebView never reloads; updates go via injectJavaScript
  const initialSource = useMemo(
    () => ({ html: generateMapHTML(lat, lng, radiusMiles) }),
    [] // eslint-disable-line react-hooks/exhaustive-deps -- intentional: only use first values
  );

  const handleMessage = (event: { nativeEvent: { data: string } }) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === "location") {
        onLocationChange?.(data.lat, data.lng);
      }
    } catch {
      // ignore parse errors
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      webViewRef.current?.injectJavaScript(
        [
          `if (typeof window.updateCenter === 'function') { window.updateCenter(${lat}, ${lng}); }`,
          `if (typeof window.updateRadius === 'function') { window.updateRadius(${radiusMiles}); }`,
          "true;",
        ].join(" ")
      );
    }, 150);
    return () => clearTimeout(timer);
  }, [lat, lng, radiusMiles]);

  return (
    <View style={[styles.container, style]}>
      <WebView
        ref={webViewRef}
        source={initialSource}
        style={styles.map}
        onMessage={handleMessage}
        javaScriptEnabled
        domStorageEnabled
        scrollEnabled={false}
      />
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
  map: {
    flex: 1,
  },
});
