import { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import AntDesign from "@expo/vector-icons/AntDesign";
import { useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";

import { Button } from "@/components/button/Button";
import { lightGrayColor } from "@/constants/theme";
import BookingDetails from "@/features/bookings/components/BookingDetails";
import { CancelBookingButton } from "@/features/bookings/components/CancelBookingButton";
import { RateBookingButton } from "@/features/bookings/components/RateBookingButton";
import { usePetOwnerBooking } from "@/hooks/pet-owner/use-pet-owner-booking";
import { usePetOwnerProfile } from "@/hooks/pet-owner/use-pet-owner-profile";
import { useMessage } from "@/hooks/use-message";

export default function BookingScreen() {
  const { bookingId } = useLocalSearchParams();
  const { profile } = usePetOwnerProfile();
  const { booking, isLoadingBooking, getBooking, payBooking, isPayingBooking } =
    usePetOwnerBooking();
  const [tempPaid, setTempPaid] = useState(false);
  const queryClient = useQueryClient();

  const message = useMessage();

  const isOwner = booking?.usersId === profile?.id;
  const isPaid = useMemo(
    () => booking?.paymentStatus?.status === "paid" || tempPaid,
    [booking?.paymentStatus?.status, tempPaid]
  );

  useEffect(() => {
    getBooking(bookingId as string);
  }, [bookingId, getBooking]);

  if (isLoadingBooking) return <Text>Loading booking...</Text>;

  if (!booking?.pets?.length) return <Text>Booking Not Found</Text>;

  let paymentButton = null;

  const handlePayNow = () => {
    payBooking(
      {
        bookingId: booking.id,
      },
      {
        onSuccess: () => {
          setTempPaid(true);
          queryClient.refetchQueries({
            queryKey: ["booking", booking.id],
          });
        },
      }
    );
  };

  if (isOwner) {
    if (
      booking.amount &&
      booking.paymentStatusId === 1 &&
      // booking.bookingStatus?.status === "completed" &&
      !isPaid
    ) {
      // TODO: Once the user is paid disable this button even the payment is not yet completed
      paymentButton = (
        <Button
          title="Pay Now"
          onPress={handlePayNow}
          size="sm"
          disabled={isPayingBooking}
        />
      );
    } else if (
      booking.bookingStatus?.status === "completed" &&
      !booking.reviews
    ) {
      paymentButton = <RateBookingButton booking={booking} />;
    }
  }

  const messageButton = (
    <TouchableOpacity onPress={() => message(booking.careGiversId)}>
      <AntDesign name="message" size={20} color="black" />
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={styles.container}
      nestedScrollEnabled
      keyboardShouldPersistTaps="handled"
    >
      <BookingDetails
        booking={booking}
        paymentButton={paymentButton}
        messageButton={messageButton}
      />
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
