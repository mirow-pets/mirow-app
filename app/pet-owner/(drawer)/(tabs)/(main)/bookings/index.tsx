import { StyleSheet, TouchableOpacity, View } from "react-native";

import { useRouter } from "expo-router";

import { PetAvatar } from "@/components/image/PetAvatar";
import { InfiniteFlatList } from "@/components/list/InfiniteFlatList";
import { ThemedText } from "@/components/themed-text";
import { primaryColor } from "@/constants/theme";
import { TBooking } from "@/types";
import { formatDateToMDY } from "@/utils";

export default function MyBookingsScreen() {
  const router = useRouter();

  const handleView = (petId: string) => {
    router.push(`/pet-owner/bookings/${petId}`, {
      relativeToDirectory: true,
    });
  };

  return (
    <View style={styles.container}>
      <InfiniteFlatList<TBooking>
        url="/users/bookings"
        perPage={5}
        style={{ height: 400 }}
        contentContainerStyle={{ paddingBottom: 100 }}
        order="createdat DESC"
        renderItem={({ item }) => {
          const pet = item.pets?.[0];

          if (!pet) return null;

          return (
            <TouchableOpacity
              key={item.id}
              style={styles.itemContainer}
              onPress={() => handleView(item.id)}
            >
              <PetAvatar src={pet.profileImage} size={40} />
              <View style={{ flex: 1 }}>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 8,
                    justifyContent: "space-between",
                  }}
                >
                  <ThemedText type="defaultSemiBold">
                    {pet.name ?? "—"}
                  </ThemedText>
                  <ThemedText style={{ color: primaryColor }}>
                    {item.serviceTypes?.display ?? "—"}
                  </ThemedText>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    gap: 8,
                    justifyContent: "space-between",
                    flex: 1,
                  }}
                >
                  <ThemedText
                    style={{
                      fontSize: 12,
                      textAlign: "right",
                      color: "#333333",
                    }}
                  >
                    {item.startDate ? formatDateToMDY(item.startDate) : "—"}
                  </ThemedText>

                  <ThemedText type="defaultSemiBold">
                    {item?.bookingStatus?.display ?? "—"}
                  </ThemedText>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 8,
    flex: 1,
  },
  itemContainer: {
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
});
