import { TouchableOpacity } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { primaryColor, whiteColor } from "@/constants/theme";

export interface FilterButtonProps {
  onPress: () => void;
}

export const FilterButton = ({ onPress }: FilterButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        paddingVertical: 4,
        paddingHorizontal: 4,
        borderWidth: 1,
        borderColor: whiteColor,
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 4,
        elevation: 3,
        backgroundColor: primaryColor,
      }}
    >
      <Ionicons name="filter-outline" size={16} color={whiteColor} />
    </TouchableOpacity>
  );
};
