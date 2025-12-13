import { useEffect } from "react";

import { useLocalSearchParams } from "expo-router";

import { ThemedText } from "@/components/themed-text";
import { CaregiverDetails } from "@/features/caregivers/components/CaregiverDetails";
import { usePetOwnerCaregiver } from "@/hooks/pet-owner/use-pet-owner-caregiver";

export default function CaregiverScreen() {
  const { userId } = useLocalSearchParams();
  const { caregiver, isLoadingCaregiver, getCaregiver } =
    usePetOwnerCaregiver();

  useEffect(() => getCaregiver(userId as string), [userId, getCaregiver]);

  if (isLoadingCaregiver) return <ThemedText>Loading caregiver...</ThemedText>;

  if (!caregiver) return <ThemedText>Caregiver Not Found</ThemedText>;

  return <CaregiverDetails caregiver={caregiver} />;
}
