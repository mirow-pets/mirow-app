import { View } from "react-native";

import { ScrollView } from "react-native-gesture-handler";

import { AddPetForm } from "@/features/pets/components/AddPetForm";

export default function AddPetScreen() {
  return (
    <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="handled">
      <AddPetForm />
      <View style={{ height: 100 }} />
    </ScrollView>
  );
}
