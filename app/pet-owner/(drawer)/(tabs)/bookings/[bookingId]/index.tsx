import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";

import { PetAvatar } from "@/components/image/PetAvatar";
import { ThemedText } from "@/components/themed-text";
import { primaryColor } from "@/constants/theme";
import { CancelBookingButton } from "@/features/bookings/components/CancelBookingButton";
import { useBooking } from "@/hooks/use-booking";
import { formatDateToMDY } from "@/utils";

export default function BookingScreen() {
  const { bookingId } = useLocalSearchParams();
  const { booking, isLoadingBooking, getBooking } = useBooking();
  const router = useRouter();

  useEffect(() => getBooking(bookingId as string), [bookingId, getBooking]);

  // const handleDelete = () => {
  //   confirm({
  //     title: "Delete booking",
  //     description: "Are you sure you want to delete the booking?",
  //     onConfirm: () => deleteBooking(booking.id),
  //   });
  // };

  if (isLoadingBooking) return <Text>Loading booking...</Text>;

  if (!booking?.pets?.length) return <Text>Booking Not Found</Text>;

  const pet = booking.pets[0];

  const handleEdit = () => {
    router.push(`/pet-owner/bookings/${bookingId}/edit`);
  };

  return (
    <ScrollView nestedScrollEnabled={true}>
      <View style={styles.container}>
        <View style={styles.banner}>
          <PetAvatar src={pet.profileImage} />
          <View style={{ flex: 1 }}>
            <ThemedText>{pet.name}</ThemedText>
            <ThemedText style={{ fontSize: 12 }}>
              {pet.petTypes?.display}
            </ThemedText>
          </View>
          <ThemedText style={{ color: primaryColor }}>
            {booking.serviceTypes?.display}
          </ThemedText>
          {/* <TouchableOpacity
            onPress={handleEdit}
            style={{ width: 50 }}
            disabled={isDeletingBooking}
          >
            <Text>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleDelete}
            style={{ width: 50 }}
            disabled={isDeletingBooking}
          >
            <Text>Delete</Text>
          </TouchableOpacity> */}
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
            {formatDateToMDY(booking.startDate)}
          </ThemedText>

          <ThemedText type="defaultSemiBold" style={{}}>
            {booking?.bookingStatus?.display}
          </ThemedText>
        </View>
        <View>
          {["booked", "accepted"].includes(
            booking.bookingStatus?.status ?? ""
          ) && <CancelBookingButton bookingId={booking.id} />}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    width: "100%",
    gap: 8,
  },
  banner: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },

  infoCard: {
    flexDirection: "row",
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 10,
    paddingLeft: "5%",
  },
  vaccineText: {
    fontSize: 18,
    color: "#000000",
    alignSelf: "center",
  },
  ownerName: {
    fontSize: 18,
    color: "#020202",
  },
  notes: {
    backgroundColor: "#38b6ff30",
    paddingVertical: 8,
    borderRadius: 10,
    marginVertical: 5,
    paddingHorizontal: 20,
    minHeight: 65,
  },
  lableText: {
    marginRight: 15,
    marginBottom: 15,
    color: "#404040",
    fontSize: 15,
  },
  label: {
    fontSize: 15,
    color: "#020202",
    marginBottom: 15,
  },
  lableValue: {
    fontSize: 15,
    color: "#000000",
    marginBottom: 6,
  },
  dottedStyle: {
    borderWidth: 0.5,
    // borderStyle: 'dotted',
    width: 150,
    borderColor: "#a6a6a6",
    marginBottom: 5,
  },
});
