import { StyleProp, StyleSheet, TextStyle, View } from "react-native";

import GooglePlacesTextInput, {
  Place,
} from "react-native-google-places-textinput";

import { ENV } from "@/env";

export interface PlaceAutoCompleteProps {
  value?: string;
  onChange: (_value: { city: string; state: string; country: string }) => void;
  style?: StyleProp<TextStyle>;
  placeholder?: string;
  onBlur?: (e: any) => void;
  onFocus?: (e: any) => void;
}

export const PlaceAutoComplete = ({
  value,
  style,
  placeholder,
  onChange,
  onBlur,
  onFocus,
}: PlaceAutoCompleteProps) => {
  const handlePlaceSelect = (place: Place) => {
    const { details } = place;
    if (details) {
      const addressComponents = details.addressComponents;
      const getComponent = (types: string[]) => {
        const component = addressComponents.find((comp: { types: string[] }) =>
          types?.some((type) => comp.types.includes(type))
        );
        return component
          ? types.includes("country")
            ? component.shortText
            : component.longText
          : null;
      };
      const city =
        getComponent([
          "locality",
          "administrative_area_level_2",
          "postal_town",
          "sublocality",
        ]) || "Unknown City";
      const state =
        getComponent(["administrative_area_level_1"]) || "Unknown State";
      const country = getComponent(["country"]) || "Unknown Country";

      onChange({ city, state, country });
    }
  };

  return (
    <View style={{ width: "100%" }}>
      <GooglePlacesTextInput
        value={value}
        showClearButton={false}
        placeHolderText={placeholder}
        detailsFields={["addressComponents", "formattedAddress", "location"]}
        fetchDetails
        includedRegionCodes={["us"]}
        apiKey={ENV.GOOGLE_MAPS_API_KEY}
        onPlaceSelect={handlePlaceSelect}
        onBlur={onBlur}
        onFocus={onFocus}
        style={{
          input: style,
          suggestionsContainer: {
            zIndex: 100,
          },
          suggestionText: {
            main: styles.textStyle,
          },
          suggestionItem: styles.row,
          container: styles.container,
        }}
        nestedScrollEnabled={true}
        debounceDelay={300}
        // NOTE: This can be tricky and may require more advanced logic.
        // A simpler approach is to rely on user input (e.g., "123 Main St, Florida")
        biasPrefixText={(text) => {
          if (
            !text.toLowerCase().includes("fl") &&
            !text.toLowerCase().includes("florida")
          ) {
            return `Florida, ${text}`;
          }

          return text;
        }}
        scrollEnabled={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "auto",
  },
  textStyle: {
    color: "#020202",
  },
  row: {
    backgroundColor: "#f1f1f1",
  },
});
