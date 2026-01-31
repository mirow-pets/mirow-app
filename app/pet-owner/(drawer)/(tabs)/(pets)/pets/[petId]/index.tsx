import { useEffect } from "react";
import { TouchableOpacity } from "react-native";

import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";

import { ThemedText } from "@/components/themed-text";
import { PetDetails } from "@/features/pets/components/PetDetails";
import { usePetOwnerPet } from "@/hooks/pet-owner/use-pet-owner-pet";
import { confirm } from "@/utils";

export default function PetScreen() {
  const { petId } = useLocalSearchParams();
  const { pet, isLoadingPet, getPet, deletePet, isDeletingPet } =
    usePetOwnerPet();
  const router = useRouter();

  useEffect(() => getPet(petId as string), [petId, getPet]);

  const handleDelete = () => {
    confirm({
      title: "Delete pet",
      description: "Are you sure you want to delete the pet?",
      onConfirm: () => deletePet(pet.id),
    });
  };

  if (isLoadingPet) return <ThemedText>Loading pet...</ThemedText>;

  if (!pet) return <ThemedText>Pet Not Found</ThemedText>;

  const handleEdit = () => {
    router.push(`/pet-owner/pets/${petId}/edit`);
  };

  return (
    <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="handled">
      <PetDetails
        pet={pet}
        actions={
          <>
            <TouchableOpacity
              onPress={handleEdit}
              style={{ width: 50 }}
              disabled={isDeletingPet}
            >
              <ThemedText>Edit</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleDelete}
              style={{ width: 50 }}
              disabled={isDeletingPet}
            >
              <ThemedText>Delete</ThemedText>
            </TouchableOpacity>
          </>
        }
      />
    </ScrollView>
  );
}
