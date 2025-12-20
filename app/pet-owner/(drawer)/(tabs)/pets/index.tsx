import { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { useRouter } from "expo-router";

import { SearchButton } from "@/components/button/SearchButton";
import { SearchInput } from "@/components/form/SearchInput";
import { PetAvatar } from "@/components/image/PetAvatar";
import { InfiniteFlatList } from "@/components/list/InfiniteFlatList";
import { ThemedText } from "@/components/themed-text";
import { grayColor, whiteColor } from "@/constants/theme";
import { PetTypesSelector } from "@/features/pets/components/PetTypesSelector";
import { useThemeColor } from "@/hooks/use-theme-color";
import { TPet } from "@/types";
import { TPetType } from "@/types/pets";

export default function PetsScreen() {
  const primaryColor = useThemeColor({}, "primary");
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

  const handleView = (petId: string) => {
    router.push(`/pet-owner/pets/${petId}`);
  };

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <ThemedText type="defaultSemiBold" style={{ color: primaryColor }}>
          Who is getting spoiled?
        </ThemedText>
        <SearchButton onPress={() => setShowSearch((value) => !value)} />
      </View>

      {showSearch && <SearchInput value={search} onChange={setSearch} />}

      <PetTypesSelector
        value={selectedTypeIds}
        onChange={setSelectePetTypeIds}
      />

      <View style={{ flex: 1 }}>
        <InfiniteFlatList<TPet>
          url="/v2/users/pets"
          perPage={5}
          queryParams={{
            petTypeIds: selectedTypeIds,
            search,
          }}
          contentContainerStyle={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "flex-start",
            paddingBottom: 80,
            columnGap: "4%",
          }}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              key={index}
              style={styles.itemContainer}
              onPress={() => handleView(item.id)}
            >
              <PetAvatar
                src={item.profileImage}
                style={{
                  borderRadius: 0,
                  width: "100%",
                  height: 150,
                }}
              />
              <View style={styles.petInfo}>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 8,
                    alignItems: "center",
                  }}
                >
                  <ThemedText type="defaultSemiBold" style={styles.petName}>
                    {item.name}
                  </ThemedText>
                  {item.breed && (
                    <ThemedText style={styles.petBreed}>
                      ({item.breed})
                    </ThemedText>
                  )}
                </View>
                <View style={[styles.petChip, { borderColor: primaryColor }]}>
                  <ThemedText style={styles.petGender}>
                    {item.gender === null
                      ? "Unknown"
                      : item.gender
                      ? "Male"
                      : "Female"}
                    , {item.age > 1 ? `${item.age}yrs` : `${item.age}yr`}
                  </ThemedText>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: primaryColor }]}
        onPress={handleAdd}
      >
        <ThemedText style={styles.fabText}>+</ThemedText>
      </TouchableOpacity>
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
  itemContainer: {
    // minWidth: "100%",
    minWidth: "48%",
    backgroundColor: whiteColor,
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3, // for Android shadow
  },
  petInfo: {
    padding: 12,
    width: "100%",
    gap: 8,
  },
  petName: {
    fontSize: 20,
    fontWeight: "600",
  },
  petBreed: {
    fontSize: 14,
    fontStyle: "italic",
    color: grayColor,
  },
  petChip: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 1,
    alignSelf: "flex-start",
  },
  petGender: {
    fontSize: 10,
    color: "#666",
    marginTop: 4,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 100,
    width: 58,
    height: 58,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  fabText: {
    color: "white",
    fontSize: 30,
    lineHeight: 30,
  },
});
