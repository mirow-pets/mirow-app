import { TouchableOpacity } from "react-native";

import { Ionicons } from "@expo/vector-icons";

export interface SearchButtonProps {
  onPress: () => void;
}

export const SearchButton = ({ onPress }: SearchButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        paddingVertical: 4,
        paddingHorizontal: 4,
        borderWidth: 1,
        borderColor: "black",
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 4,
        elevation: 3,
        backgroundColor: "white",
      }}
    >
      <Ionicons name="search" size={16} color="black" />
    </TouchableOpacity>
  );
};
