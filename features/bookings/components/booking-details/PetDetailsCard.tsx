import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

import { PetAvatar } from "@/components/image/PetAvatar";
import { ThemedText } from "@/components/themed-text";
import { lightGrayColor } from "@/constants/theme";
import { TPet } from "@/types";

export interface PetDetailsCardCardProps {
  title: string;
  pet: TPet;
  actions?: ReactNode;
}

export const PetDetailsCardCard = ({
  title,
  pet,
  actions,
}: PetDetailsCardCardProps) => {
  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          gap: 8,
          justifyContent: "space-between",
        }}
      >
        <ThemedText type="defaultSemiBold" style={{ marginBottom: 8 }}>
          {title}
        </ThemedText>
        {actions}
      </View>
      <View style={styles.petInfo}>
        <PetAvatar src={pet.profileImage} size={64} />
        <View>
          <ThemedText>{pet.name}</ThemedText>
          <ThemedText style={styles.smallText}>
            Type: {pet.petTypes?.display}
          </ThemedText>
          <ThemedText style={styles.smallText}>Breed: {pet.breed}</ThemedText>
          <ThemedText style={styles.smallText}>
            Gender: {pet.gender ? "Male" : "Female"}
          </ThemedText>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    padding: 16,
    gap: 8,
    backgroundColor: lightGrayColor,
  },
  petInfo: {
    flexDirection: "row",
    gap: 16,
  },
  smallText: {
    fontSize: 12,
  },
});
