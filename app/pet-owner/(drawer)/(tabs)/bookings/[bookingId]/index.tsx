import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

import { useLocalSearchParams } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";

import { lightGrayColor } from "@/constants/theme";
import BookingDetails from "@/features/bookings/components/BookingDetails";
import { CancelBookingButton } from "@/features/bookings/components/CancelBookingButton";
import { usePetOwnerBooking } from "@/hooks/pet-owner/use-pet-owner-booking";
import { usePetOwnerProfile } from "@/hooks/pet-owner/use-pet-owner-profile";
import { useAuth } from "@/hooks/use-auth";
import { UserRole } from "@/types/users";

export default function BookingScreen() {
  const { bookingId } = useLocalSearchParams();
  const { userRole } = useAuth();
  const { profile } = usePetOwnerProfile();
  const { booking, isLoadingBooking, getBooking } = usePetOwnerBooking();

  const isPetOwner = userRole === UserRole.PetOwner;
  const isOwner = booking?.usersId === profile?.id;

  useEffect(() => {
    if (!isPetOwner) return;
    getBooking(bookingId as string);
  }, [isPetOwner, bookingId, getBooking]);

  if (isLoadingBooking) return <Text>Loading booking...</Text>;

  if (!booking?.pets?.length) return <Text>Booking Not Found</Text>;

  return (
    <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="handled">
      <View style={styles.container}>
        <BookingDetails booking={booking} isOwner={isOwner} />
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
