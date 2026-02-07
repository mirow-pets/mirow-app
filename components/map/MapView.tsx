import { useEffect, useMemo, useRef } from "react";
import { StyleSheet, View } from "react-native";

import { WebView } from "react-native-webview";

import { ENV } from "@/env";

import type { MapViewProps } from "./MapView.types";

const DEFAULT_LAT = 26.5;
const DEFAULT_LNG = -81.9;
const DEFAULT_HEIGHT = 300;

function generateMapHTML(height: number) {
  return `
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body { margin: 0; padding: 0; }
      #map { height: 100%; width: 100%; min-height: ${height}px; }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script>
      var map, centerMarker, circleObj;
      var markersById = {};
      var defaultCenter = { lat: ${DEFAULT_LAT}, lng: ${DEFAULT_LNG} };

      function getIcon(pinColor) {
        var icons = {
          green: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
          red: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
          blue: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
        };
        return (pinColor && icons[pinColor]) ? icons[pinColor] : null;
      }

      function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
          zoom: 10,
          center: defaultCenter,
          mapTypeId: 'roadmap',
          streetViewControl: false,
          mapTypeControl: true,
          fullscreenControl: true,
          zoomControl: true,
          gestureHandling: "auto"
        });

        map.addListener('click', function(event) {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'mapPress',
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
          }));
        });

        window.updateMap = function(opts) {
          var markers = opts.markers || [];
          var circle = opts.circle;
          var draggableCenter = opts.draggableCenter;
          var center = opts.center;
          var zoom = opts.zoom;

          markers.forEach(function(m) {
            var pos = { lat: m.lat, lng: m.lng };
            if (!markersById[m.id]) {
              markersById[m.id] = new google.maps.Marker({
                position: pos,
                map: map,
                title: m.title || '',
                icon: getIcon(m.pinColor) || undefined
              });
            } else {
              markersById[m.id].setPosition(pos);
              markersById[m.id].setMap(map);
            }
          });
          Object.keys(markersById).forEach(function(id) {
            if (!markers.find(function(m) { return m.id === id; })) {
              markersById[id].setMap(null);
            }
          });

          if (circle && circle.lat != null && circle.lng != null) {
            var center = { lat: circle.lat, lng: circle.lng };
            if (!circleObj) {
              circleObj = new google.maps.Circle({
                strokeColor: '#37b2ff',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#37b2ff',
                fillOpacity: 0.2,
                map: map,
                center: center,
                radius: circle.radiusMeters || 5000
              });
            } else {
              circleObj.setCenter(center);
              circleObj.setRadius(circle.radiusMeters || 5000);
            }
            if (draggableCenter) {
              if (!centerMarker) {
                centerMarker = new google.maps.Marker({
                  position: center,
                  map: map,
                  draggable: true,
                  title: 'Your Location'
                });
                centerMarker.addListener('dragend', function(event) {
                  var newLat = event.latLng.lat();
                  var newLng = event.latLng.lng();
                  window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'location',
                    lat: newLat,
                    lng: newLng
                  }));
                  circleObj.setCenter({ lat: newLat, lng: newLng });
                });
              } else {
                centerMarker.setPosition(center);
                centerMarker.setMap(map);
              }
            } else if (centerMarker) {
              centerMarker.setMap(null);
            }
          } else {
            if (circleObj) { circleObj.setMap(null); circleObj = null; }
            if (centerMarker) { centerMarker.setMap(null); }
          }

          if (markers.length >= 2) {
            var bounds = new google.maps.LatLngBounds();
            markers.forEach(function(m) { bounds.extend({ lat: m.lat, lng: m.lng }); });
            map.fitBounds(bounds);
          } else if (markers.length === 1) {
            map.panTo({ lat: markers[0].lat, lng: markers[0].lng });
          } else if (circle && circle.lat != null && circle.lng != null) {
            map.panTo({ lat: circle.lat, lng: circle.lng });
          } else if (center && center.lat != null && center.lng != null) {
            map.setCenter(center);
            if (zoom != null && zoom >= 0 && zoom <= 22) {
              map.setZoom(Math.round(zoom));
            }
          }
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
  const webViewRef = useRef<WebView>(null);
  const center = initialCenter ?? { lat: DEFAULT_LAT, lng: DEFAULT_LNG };

  const initialSource = useMemo(
    () => ({ html: generateMapHTML(height) }),
    [height]
  );

  const handleMessage = (event: { nativeEvent: { data: string } }) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === "mapPress" && data.lat != null && data.lng != null) {
        onMapPress?.(data.lat, data.lng);
      } else if (
        data.type === "location" &&
        data.lat != null &&
        data.lng != null
      ) {
        onLocationChange?.(data.lat, data.lng);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    const opts = {
      markers: markers.map((m) => ({
        id: m.id,
        lat: m.lat,
        lng: m.lng,
        title: m.title,
        pinColor: m.pinColor,
      })),
      circle:
        circle != null
          ? {
              lat: circle.lat,
              lng: circle.lng,
              radiusMeters: circle.radiusMeters,
            }
          : null,
      draggableCenter: draggableCenter === true,
      center: { lat: center.lat, lng: center.lng },
      zoom,
    };
    const timer = setTimeout(() => {
      webViewRef.current?.injectJavaScript(
        [
          "if (typeof window.updateMap === 'function') {",
          `window.updateMap(${JSON.stringify(opts)});`,
          "}",
          "true;",
        ].join(" ")
      );
    }, 150);
    return () => clearTimeout(timer);
  }, [markers, circle, draggableCenter, center.lat, center.lng, zoom]);

  return (
    <View style={[styles.container, { height }, style]}>
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
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  map: {
    flex: 1,
  },
});
