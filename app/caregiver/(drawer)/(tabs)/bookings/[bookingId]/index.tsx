import { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import AntDesign from "@expo/vector-icons/AntDesign";
import { useLocalSearchParams } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";

import { ThemedText } from "@/components/themed-text";
import { greenColor, lightGrayColor } from "@/constants/theme";
import BookingDetails from "@/features/bookings/components/BookingDetails";
import { RejectBookingButton } from "@/features/bookings/components/RejectBookingButton";
import { useCaregiverBooking } from "@/hooks/caregiver/use-caregiver-booking";
import { useMessage } from "@/hooks/use-message";
import { confirm } from "@/utils";

export default function BookingScreen() {
  const { bookingId } = useLocalSearchParams();
  const {
    isLoadingBooking,
    booking,
    acceptBooking,
    isAcceptingBooking,
    startBooking,
    isStartingBooking,
    completeBooking,
    isCompletingBooking,
    getBooking,
  } = useCaregiverBooking();

  const message = useMessage();

  useEffect(() => getBooking(bookingId as string), [bookingId, getBooking]);

  if (isLoadingBooking) return <Text>Loading booking...</Text>;

  if (!booking?.pets?.length) return <Text>Booking Not Found</Text>;

  const queue = booking?.caregiversQueues?.find(
    ({ bookingsId }) => bookingsId === booking?.id
  );

  const messageButton = (
    <TouchableOpacity onPress={() => message(booking.usersId)}>
      <AntDesign name="message" size={20} color="black" />
    </TouchableOpacity>
  );

  return (
    <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="handled">
      <View style={styles.container}>
        <BookingDetails booking={booking} messageButton={messageButton} />
        {(!!queue || booking.isOpenShift) && (
          <View>
            {booking.bookingStatus?.status === "accepted" && (
              <TouchableOpacity
                disabled={isStartingBooking}
                onPress={() =>
                  confirm({
                    title: "Service delivered",
                    description: "Are you sure to start the booking?",
                    onConfirm: () => startBooking(booking.id),
                  })
                }
              >
                <ThemedText style={{ color: greenColor }}>Start</ThemedText>
              </TouchableOpacity>
            )}
            {booking.bookingStatus?.status === "inprogress" && (
              <TouchableOpacity
                disabled={isCompletingBooking}
                onPress={() =>
                  confirm({
                    title: "Service delivered",
                    description: "Are you sure to complete the booking?",
                    onConfirm: () => completeBooking(booking.id),
                  })
                }
              >
                <ThemedText style={{ color: greenColor }}>Delivered</ThemedText>
              </TouchableOpacity>
            )}
            {booking.bookingStatus?.status === "booked" && (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: 16,
                }}
              >
                <TouchableOpacity
                  disabled={isAcceptingBooking}
                  onPress={() =>
                    confirm({
                      title: "Confirmation",
                      description: "Are you sure to accept the booking?",
                      onConfirm: () => acceptBooking(booking.id),
                    })
                  }
                >
                  <ThemedText style={{ color: greenColor }}>Accept</ThemedText>
                </TouchableOpacity>
                {queue && (
                  <RejectBookingButton
                    bookingId={booking.id}
                    careGiverQeueuId={queue.id}
                  />
                )}
              </View>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingHorizontal: 20,
    width: "100%",
    gap: 8,
    paddingBottom: 100,
  },
  bookingDetails: {
    flexDirection: "row",
    gap: 16,
    padding: 16,
    borderRadius: 8,
  },
  ownerDetails: {
    backgroundColor: lightGrayColor,
    padding: 16,
    borderRadius: 8,
  },
});
