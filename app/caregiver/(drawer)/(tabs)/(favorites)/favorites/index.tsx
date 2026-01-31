import { StyleSheet, TouchableOpacity, View } from "react-native";

import { useRouter } from "expo-router";

import { PetAvatar } from "@/components/image/PetAvatar";
import { InfiniteFlatList } from "@/components/list/InfiniteFlatList";
import { ThemedText } from "@/components/themed-text";
import { grayColor, whiteColor } from "@/constants/theme";
import { TPet } from "@/types";

export default function FavoritesScreen() {
  const router = useRouter();

  const handleView = (petId: string) => {
    router.push(`/caregiver/favorites/${petId}`);
  };

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <InfiniteFlatList<TPet>
          url="/care-givers/favourites/pets"
          perPage={5}
          contentContainerStyle={{
            paddingBottom: 80,
          }}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              key={index}
              style={styles.itemContainer}
              onPress={() => handleView(item.id)}
            >
              <PetAvatar src={item.profileImage} size={64} />
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
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
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
  itemContainer: {
    backgroundColor: whiteColor,
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    flexDirection: "row",
    padding: 16,
  },
  petInfo: {
    padding: 12,
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
