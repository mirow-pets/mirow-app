import React from "react";
import { TouchableOpacity } from "react-native";

import FontAwesome from "@expo/vector-icons/FontAwesome";

import { whiteColor } from "@/constants/theme";

export interface NextButtonProps {
  loading?: boolean;
  onPress: () => void;
}

export const NextButton = ({ loading, onPress }: NextButtonProps) => {
  return (
    <TouchableOpacity onPress={onPress} disabled={loading}>
      <FontAwesome
        name="chevron-circle-right"
        size={56}
        color={whiteColor}
        style={{
          boxShadow: `0px_3px_5px_rgba(0,0,0,0.6)`,
          textShadowColor: "rgba(0,0,0,0.6)",
          textShadowRadius: 5,
          textShadowOffset: { width: 0, height: 2 },
        }}
      />
    </TouchableOpacity>
  );
};
