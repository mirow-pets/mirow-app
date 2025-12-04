import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

import { useRouter } from "expo-router";
import { FlatList } from "react-native-gesture-handler";

import { PetAvatar } from "@/components/image/PetAvatar";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { primaryColor } from "@/constants/theme";
import { useBooking } from "@/hooks/use-booking";
import { formatDateToMDY } from "@/utils";

export default function MyBookingsScreen() {
  const { bookings, isLoadingBookings } = useBooking();
  const router = useRouter();

  const handleView = (bookingId: string) => {
    router.push(`/caregiver/bookings/${bookingId}`, {
      relativeToDirectory: true,
    });
  };

  if (isLoadingBookings) return <ThemedText>Loading my bookings…</ThemedText>;

  if (!bookings.length)
    return <ThemedText style={{ marginBottom: 8 }}>No booking yet.</ThemedText>;

  return (
    <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="handled">
      <ThemedView style={styles.container}>
        <FlatList
          scrollEnabled={false}
          data={bookings}
          renderItem={({ item, index }) => {
            const pet = item.pets?.[0];

            if (!pet) return null;

            return (
              <TouchableOpacity
                key={index}
                style={styles.itemContainer}
                onPress={() => handleView(item.id)}
              >
                <PetAvatar src={pet.profileImage} size={40} />
                <View
                  style={{
                    flex: 1,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 8,
                      justifyContent: "space-between",
                    }}
                  >
                    <ThemedText type="defaultSemiBold">{pet.name}</ThemedText>
                    <ThemedText style={{ color: primaryColor }}>
                      {item.serviceTypes?.display}
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
                      {formatDateToMDY(item.startDate)}
                    </ThemedText>

                    <ThemedText type="defaultSemiBold" style={{}}>
                      {item?.bookingStatus?.display}
                    </ThemedText>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    width: "100%",
    gap: 8,
  },
  itemContainer: {
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
});
