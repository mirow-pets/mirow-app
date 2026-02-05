import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { useRouter } from "expo-router";
import { FAB, useTheme } from "react-native-paper";

import { primaryColor, whiteColor } from "@/constants/theme";
import { PetsList } from "@/features/pets/components/PetsList";
import { TPetType } from "@/types/pets";

export default function PetsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [showSearch, setShowSearch] = useState(false);
  const [search, setSearch] = useState<string>();

  const [selectedTypeIds, setSelectePetTypeIds] = useState<TPetType["id"][]>(
    []
  );

  const handleAdd = () => {
    router.push("/pet-owner/pets/add", {
      relativeToDirectory: true,
    });
  };

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <PetsList />
        <FAB icon="plus" style={styles.fab} onPress={handleAdd} />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 20,
    width: "100%",
    gap: 16,
    flex: 1,
    backgroundColor: whiteColor,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 100,
    backgroundColor: primaryColor,
  },
});
