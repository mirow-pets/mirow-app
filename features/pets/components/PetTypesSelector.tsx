import { View } from "react-native";

import { ScrollView } from "react-native-gesture-handler";

import { Chip } from "@/components/chip/Chip";
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
            <Chip
              key={i}
              style={{
                borderColor: value.includes(petType.id)
                  ? primaryColor
                  : lightGrayColor,
              }}
              onPress={handleToggle(petType.id)}
              mode="outlined"
              size="lg"
              corner="rounded"
            >
              <ThemedText style={{ fontSize: 12 }}>
                {petType.display}
              </ThemedText>
            </Chip>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};
