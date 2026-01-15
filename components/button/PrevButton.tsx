import React from "react";
import { TouchableOpacity } from "react-native";

import FontAwesome from "@expo/vector-icons/FontAwesome";

import { whiteColor } from "@/constants/theme";

export interface PrevButtonProps {
  loading?: boolean;
  onPress: () => void;
  disabled?: boolean;
}

export const PrevButton = ({ loading, onPress, disabled }: PrevButtonProps) => {
  return (
    <TouchableOpacity
      onPress={loading ? undefined : onPress}
      disabled={loading || disabled}
    >
      <FontAwesome
        name="chevron-circle-left"
        size={56}
        color={whiteColor}
        style={{
          boxShadow: `0px_3px_5px_rgba(0,0,0,0.6)`,
          textShadowColor: "rgba(0,0,0,0.6)",
          textShadowRadius: 5,
          textShadowOffset: { width: 0, height: 2 },
          opacity: disabled ? 0.5 : undefined,
        }}
      />
    </TouchableOpacity>
  );
};
