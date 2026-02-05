import { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { FontAwesome6 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { FAB, useTheme } from "react-native-paper";

import { SearchButton } from "@/components/button/SearchButton";
import { Chip } from "@/components/chip/Chip";
import { SearchInput } from "@/components/form/SearchInput";
import { PetAvatar } from "@/components/image/PetAvatar";
import { InfiniteFlatList } from "@/components/list/InfiniteFlatList";
import { ThemedText } from "@/components/themed-text";
import { grayColor, primaryColor, whiteColor } from "@/constants/theme";
import { PetTypesSelector } from "@/features/pets/components/PetTypesSelector";
import { TPet } from "@/types";
import { TPetType } from "@/types/pets";

export interface PetsListProps {
  selectedIds?: TPet["id"][];
  onSelect?: (_pet: TPet) => void;
}

export const PetsList = ({ selectedIds, onSelect }: PetsListProps) => {
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

  const handleView = (petId: string) => {
    router.push(`/pet-owner/pets/${petId}`);
  };

  return (
    <View style={{ flex: 1, gap: 16 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <ThemedText
          type="defaultSemiBold"
          style={{ color: theme.colors.primary }}
        >
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
          key={"add-booking-pets"}
          url="/v2/users/pets"
          perPage={6}
          queryParams={{
            petTypeIds: selectedTypeIds,
            search,
          }}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.itemContainer}
              onPress={() => handleView(item.id)}
            >
              {onSelect && (
                <TouchableOpacity
                  style={styles.toggleButton}
                  onPress={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onSelect?.(item);
                  }}
                >
                  <View style={styles.toggleButtonBackground}>
                    <FontAwesome6
                      name="check-circle"
                      size={24}
                      color={
                        selectedIds?.includes(item.id)
                          ? theme.colors.primary
                          : grayColor
                      }
                    />
                  </View>
                </TouchableOpacity>
              )}
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

                <View style={{ flexDirection: "row" }}>
                  <Chip
                    mode="outlined"
                    size="sm"
                    style={{
                      height: 24,
                      justifyContent: "center",
                      alignItems: "center",
                      padding: 0,
                      margin: 0,
                    }}
                    textStyle={{
                      margin: 0,
                      padding: 0,
                    }}
                  >
                    <ThemedText style={{ fontSize: 10 }}>
                      {item.gender === null
                        ? "Unknown"
                        : item.gender
                        ? "Male"
                        : "Female"}
                      , {item.age > 1 ? `${item.age}yrs` : `${item.age}yr`}
                    </ThemedText>
                  </Chip>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
        <FAB icon="plus" style={styles.fab} onPress={handleAdd} />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 80,
    paddingHorizontal: 4,
  },
  columnWrapper: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  itemContainer: {
    flex: 1,
    maxWidth: "48%",
    minWidth: 0,
    backgroundColor: whiteColor,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
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
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 100,
    backgroundColor: primaryColor,
  },
  toggleButton: {
    position: "absolute",
    top: 8,
    left: 8,
    zIndex: 10,
    elevation: 5,
  },
  toggleButtonBackground: {
    backgroundColor: whiteColor,
    borderRadius: 16,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
