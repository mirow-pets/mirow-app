import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

import { useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";

import { Button } from "@/components/button/Button";
import { lightGrayColor } from "@/constants/theme";
import BookingDetails from "@/features/bookings/components/BookingDetails";
import { CancelBookingButton } from "@/features/bookings/components/CancelBookingButton";
import { RateBookingButton } from "@/features/bookings/components/RateBookingButton";
import { usePetOwnerBooking } from "@/hooks/pet-owner/use-pet-owner-booking";
import { usePetOwnerPayment } from "@/hooks/pet-owner/use-pet-owner-payment";
import { usePetOwnerProfile } from "@/hooks/pet-owner/use-pet-owner-profile";

export default function BookingScreen() {
  const { bookingId } = useLocalSearchParams();
  const { profile } = usePetOwnerProfile();
  const { booking, isLoadingBooking, getBooking } = usePetOwnerBooking();
  const { payCaregiver } = usePetOwnerPayment();
  const queryClient = useQueryClient();

  const isOwner = booking?.usersId === profile?.id;

  useEffect(() => {
    getBooking(bookingId as string);
  }, [bookingId, getBooking]);

  if (isLoadingBooking) return <Text>Loading booking...</Text>;

  if (!booking?.pets?.length) return <Text>Booking Not Found</Text>;

  let paymentButton = null;

  const handlePayNow = () =>
    payCaregiver(
      {
        amount: +(Number(booking.amount) * 100).toFixed(),
        caregiverId: booking.careGiversId,
        bookingId: booking.id,
      },
      () =>
        queryClient.refetchQueries({
          queryKey: ["booking", booking.id],
        })
    );

  if (isOwner) {
    if (booking.amount && booking.paymentStatusId === 1) {
      paymentButton = (
        <Button title="Pay Now" onPress={handlePayNow} size="sm" />
      );
    }

    if (booking.bookingStatus?.status === "completed") {
      paymentButton = <RateBookingButton booking={booking} />;
    }
  }

  return (
    <ScrollView
      style={styles.container}
      nestedScrollEnabled
      keyboardShouldPersistTaps="handled"
    >
      <BookingDetails booking={booking} paymentButton={paymentButton} />
      <View>
        {["booked", "accepted"].includes(
          booking.bookingStatus?.status ?? ""
        ) && <CancelBookingButton bookingId={booking.id} />}
      </View>
      <View style={{ height: 150 }} />
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
