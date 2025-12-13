import { useState } from "react";
import { TouchableOpacity } from "react-native";

import { FontAwesome } from "@expo/vector-icons";

import { grayColor, redColor } from "@/constants/theme";
import { usePetOwnerCaregiver } from "@/hooks/pet-owner/use-pet-owner-caregiver";
import { useAuth } from "@/hooks/use-auth";
import { TCaregiver, UserRole } from "@/types";

export interface SetAsFavoriteCaregiverProps {
  isFavourite: boolean;
  userId: TCaregiver["usersId"];
}

export const SetAsFavoriteCaregiver = ({
  isFavourite: _favorite,
  userId,
}: SetAsFavoriteCaregiverProps) => {
  const [isFavourite, setIsFavourite] = useState(_favorite);
  const { setAsFavourite, isSettingAsFavourite } = usePetOwnerCaregiver();
  const { userRole } = useAuth();
  const isPetOwner = userRole === UserRole.PetOwner;

  const toggle = () => {
    const value = !isFavourite;
    setAsFavourite({
      userId,
      isFavourite: value,
    });
    setIsFavourite(value);
  };

  if (!isPetOwner) return null;

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
