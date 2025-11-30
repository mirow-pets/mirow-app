import { ScrollView } from "react-native-gesture-handler";

import { AddPetForm } from "@/features/pets/components/AddPetForm";

export default function AddPetScreen() {
  return (
    <ScrollView nestedScrollEnabled={true}>
      <AddPetForm />
    </ScrollView>
  );
}
