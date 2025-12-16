import { useEffect } from "react";

import { useLocalSearchParams } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";

import { ThemedText } from "@/components/themed-text";
import { PetDetails } from "@/features/pets/components/PetDetails";
import { SetAsFavoritePet } from "@/features/pets/components/SetAsFavoritePet";
import { useCaregiverPet } from "@/hooks/caregiver/use-caregiver-pet";

export default function BookingPetScreen() {
  const { petId } = useLocalSearchParams();
  const { pet, isLoadingPet, getPet } = useCaregiverPet();

  useEffect(() => getPet(petId as string), [petId, getPet]);

  if (isLoadingPet) return <ThemedText>Loading pet...</ThemedText>;

  if (!pet) return <ThemedText>Pet Not Found</ThemedText>;

  return (
    <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="handled">
      <PetDetails
        pet={pet}
        actions={
          <SetAsFavoritePet petId={pet.id} isFavourite={!!pet.isFavourite} />
        }
      />
    </ScrollView>
  );
}
