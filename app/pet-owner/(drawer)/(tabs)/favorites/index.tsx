import { StyleSheet, TouchableOpacity, View } from "react-native";

import { useRouter } from "expo-router";

import { UserAvatar } from "@/components/image/UserAvatar";
import { InfiniteFlatList } from "@/components/list/InfiniteFlatList";
import { ThemedText } from "@/components/themed-text";
import { grayColor, whiteColor } from "@/constants/theme";
import { TCaregiver } from "@/types";

export default function FavoritesScreen() {
  const router = useRouter();

  const handleView = (userId: string) => {
    router.push(`/pet-owner/favorites/${userId}`);
  };

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <InfiniteFlatList<TCaregiver>
          url="/users/favourites/care-givers"
          perPage={5}
          contentContainerStyle={{
            paddingBottom: 80,
          }}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              key={index}
              style={styles.itemContainer}
              onPress={() => handleView(item.usersId)}
            >
              <UserAvatar src={item.users.profileImage} size={64} />
              <View style={styles.caregiverInfo}>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 8,
                    alignItems: "center",
                  }}
                >
                  <ThemedText
                    type="defaultSemiBold"
                    style={styles.caregiverName}
                  >
                    {item.users.firstName} {item.users.lastName}
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
  caregiverInfo: {
    padding: 12,
    gap: 8,
  },
  caregiverName: {
    fontSize: 20,
    fontWeight: "600",
  },
  caregiverBreed: {
    fontSize: 14,
    fontStyle: "italic",
    color: grayColor,
  },
  caregiverChip: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 1,
    alignSelf: "flex-start",
  },
  caregiverGender: {
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
