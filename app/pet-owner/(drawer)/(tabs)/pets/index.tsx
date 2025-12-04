import { StyleSheet, TouchableOpacity } from "react-native";

import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
import { FlatList, ScrollView } from "react-native-gesture-handler";

import { Button } from "@/components/button/Button";
import { PetAvatar } from "@/components/image/PetAvatar";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { usePet } from "@/hooks/use-pet";

export default function PetsScreen() {
  const router = useRouter();
  const { pets, isLoadingPets, getPetType } = usePet();

  const handleAdd = () => {
    router.push("/pet-owner/pets/add", {
      relativeToDirectory: true,
    });
  };

  const handleView = (petId: string) => {
    router.push(`/pet-owner/pets/${petId}`, {
      relativeToDirectory: true,
    });
  };

  return (
    <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="handled">
      <ThemedView style={styles.container}>
        <Button onPress={handleAdd} title="Add Pet" size="sm" />
        {isLoadingPets ? (
          <ThemedText>Loading pets…</ThemedText>
        ) : pets.length === 0 ? (
          <>
            <ThemedText style={{ marginBottom: 8 }}>No pets yet.</ThemedText>
          </>
        ) : (
          <FlatList
            scrollEnabled={false}
            data={pets}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                key={index}
                style={styles.itemContainer}
                onPress={() => handleView(item.id)}
              >
                <PetAvatar src={item.profileImage} size={40} />
                <ThemedView style={{ flex: 1 }}>
                  <ThemedText type="defaultSemiBold">{item.name}</ThemedText>
                  <ThemedText style={{ fontSize: 12 }}>
                    {getPetType(item.petTypesId)?.display}
                  </ThemedText>
                </ThemedView>
                <AntDesign name="right" size={16} color="black" />
              </TouchableOpacity>
            )}
          />
        )}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    width: "100%",
    gap: 8,
  },
  itemContainer: {
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
});
