import { useState } from "react";
import { TouchableOpacity } from "react-native";

import { FontAwesome } from "@expo/vector-icons";

import { grayColor, redColor } from "@/constants/theme";
import { useCaregiverPet } from "@/hooks/caregiver/use-caregiver-pet";
import { TPet } from "@/types";

export interface SetAsFavoritePetProps {
  isFavourite: boolean;
  petId: TPet["id"];
}

export const SetAsFavoritePet = ({
  isFavourite: _favorite,
  petId,
}: SetAsFavoritePetProps) => {
  const [isFavourite, setIsFavourite] = useState(_favorite);
  const { setAsFavourite, isSettingAsFavourite } = useCaregiverPet();

  const toggle = () => {
    const value = !isFavourite;
    setAsFavourite({
      petId,
      isFavourite: value,
    });
    setIsFavourite(value);
  };

  return (
    <TouchableOpacity onPress={toggle} disabled={isSettingAsFavourite}>
      <FontAwesome
        name="heart"
        size={20}
        color={isFavourite ? redColor : grayColor}
      />
    </TouchableOpacity>
  );
};
