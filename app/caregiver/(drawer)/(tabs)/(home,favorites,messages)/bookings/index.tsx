import { StyleSheet, TouchableOpacity, View } from "react-native";

import { useRouter } from "expo-router";

import { PetAvatar } from "@/components/image/PetAvatar";
import { InfiniteFlatList } from "@/components/list/InfiniteFlatList";
import { ThemedText } from "@/components/themed-text";
import { useThemeColor } from "@/hooks/use-theme-color";
import { TBooking } from "@/types";
import { formatDateToMDY } from "@/utils";

export default function MyBookingsScreen() {
  const router = useRouter();
  const primaryColor = useThemeColor({}, "primary");

  const handleView = (bookingId: string) => {
    router.push(`/caregiver/bookings/${bookingId}`, {
      relativeToDirectory: true,
    });
  };

  return (
    <View style={styles.container}>
      <InfiniteFlatList<TBooking>
        url="/care-givers/bookings"
        perPage={5}
        order="createdat DESC"
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    width: "100%",
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
