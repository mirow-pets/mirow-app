import { TouchableOpacity, View } from "react-native";

import { ScrollView } from "react-native-gesture-handler";

import { ThemedText } from "@/components/themed-text";
import { lightGrayColor } from "@/constants/theme";
import { usePetOwnerPet } from "@/hooks/pet-owner/use-pet-owner-pet";
import { useThemeColor } from "@/hooks/use-theme-color";
import { TPetType } from "@/types/pets";

export interface PetTypesSelectorProps {
  value: TPetType["id"][];
  onChange: (_value: TPetType["id"][]) => void;
}

export const PetTypesSelector = ({
  value,
  onChange,
}: PetTypesSelectorProps) => {
  const { petTypes } = usePetOwnerPet();
  const primaryColor = useThemeColor({}, "primary");

  const handleToggle = (petTypeId: TPetType["id"]) => () => {
    if (value.includes(petTypeId))
      onChange(value.filter((item) => item !== petTypeId));
    else onChange([...value, petTypeId]);
  };

  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ height: 32 }}
      >
        <View style={{ flexDirection: "row", gap: 8, height: 32 }}>
          {petTypes.map((petType, i) => (
            <TouchableOpacity
              key={i}
              style={{
                borderWidth: 1,
                borderColor: value.includes(petType.id)
                  ? primaryColor
                  : lightGrayColor,
                paddingHorizontal: 8,
                paddingTop: 4,
                paddingBottom: 2,
                borderRadius: 8,
              }}
              onPress={handleToggle(petType.id)}
            >
              <ThemedText style={{ fontSize: 14 }}>
                {petType.display}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};
