import { useEffect } from "react";
import { Text } from "react-native";

import { useLocalSearchParams } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";

import { EditPetForm } from "@/features/pets/components/EditPetForm";
import { usePet } from "@/hooks/use-pet";

export default function EditPetScreen() {
  const searchParams = useLocalSearchParams();
  const { pet, isLoadingPet, getPet } = usePet();
  const petId = searchParams.petId as string;

  useEffect(() => getPet(petId), [petId, getPet]);

  if (isLoadingPet) return <Text>Loading pet...</Text>;

  if (!pet) return <Text>Pet Not Found</Text>;

  return (
    <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="handled">
      <EditPetForm defaultValues={{ petId, petVaccinations: [], ...pet }} />
    </ScrollView>
  );
}
