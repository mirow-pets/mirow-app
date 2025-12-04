import { useEffect } from "react";
import {
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useLocalSearchParams } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";

import { PetAvatar } from "@/components/image/PetAvatar";
import { UserAvatar } from "@/components/image/UserAvatar";
import { ThemedText } from "@/components/themed-text";
import {
  blueColor,
  greenColor,
  lightGrayColor,
  primaryColor,
  whiteColor,
} from "@/constants/theme";
import { CancelBookingButton } from "@/features/bookings/components/CancelBookingButton";
import { useAuth } from "@/hooks/use-auth";
import { useBooking } from "@/hooks/use-booking";
import { UserRole } from "@/types/users";
import { confirm } from "@/utils";
import { formatTimeToAmPm, formatToDateTextMDY } from "@/utils/date";

export default function BookingScreen() {
  const { bookingId } = useLocalSearchParams();
  const { userRole } = useAuth();
  const {
    booking,
    isLoadingBooking,
    getBooking,
    completeBooking,
    isCompletingBooking,
  } = useBooking();

  const isPetOwner = userRole === UserRole.PetOwner;

  useEffect(() => getBooking(bookingId as string), [bookingId, getBooking]);

  if (isLoadingBooking) return <Text>Loading booking...</Text>;

  if (!booking?.pets?.length) return <Text>Booking Not Found</Text>;

  const pet = booking.pets[0];

  return (
    <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="handled">
      <View style={styles.container}>
        <View style={styles.bookingDetails}>
          <PetAvatar src={pet.profileImage} size={100} />
          <View style={{ flex: 1 }}>
            <ThemedText type="defaultSemiBold" style={{ color: whiteColor }}>
              Name: {pet.name}
            </ThemedText>
            <ThemedText style={{ fontSize: 12, color: whiteColor }}>
              Type: {pet.petTypes?.display}
            </ThemedText>
            <ThemedText style={{ fontSize: 12, color: whiteColor }}>
              Service: {booking.serviceTypes?.display}
            </ThemedText>
            <ThemedText style={{ fontSize: 12, color: whiteColor }}>
              Gender: {pet.gender ? "Male" : "Female"}
            </ThemedText>
            <ThemedText style={{ fontSize: 12, color: whiteColor }}>
              Start: {formatToDateTextMDY(booking.startDate)}{" "}
              {formatTimeToAmPm(booking.startDate)}
            </ThemedText>
            <ThemedText style={{ fontSize: 12, color: whiteColor }}>
              Status: {booking?.bookingStatus?.display}
            </ThemedText>
          </View>
        </View>
        <View style={styles.ownerDetails}>
          <ThemedText type="defaultSemiBold" style={{ marginBottom: 8 }}>
            Pet owner
          </ThemedText>
          <View style={{ flexDirection: "row", gap: 16 }}>
            <UserAvatar src={booking?.users?.profileImage} size={64} />
            <View>
              <ThemedText>
                {booking?.users?.firstName} {booking?.users?.lastName}
              </ThemedText>
              <View style={{ flexDirection: "row", gap: 4 }}>
                <ThemedText
                  style={{
                    fontSize: 12,
                  }}
                >
                  Phone:
                </ThemedText>
                <ThemedText
                  style={{
                    fontSize: 12,
                    textDecorationLine: "underline",
                    color: blueColor,
                  }}
                  onPress={() =>
                    Linking.openURL(`tel:${booking?.users?.phone}`)
                  }
                >
                  {booking?.users?.phone}
                </ThemedText>
              </View>
            </View>
          </View>
        </View>
        {isPetOwner ? (
          <View>
            {["booked", "accepted"].includes(
              booking.bookingStatus?.status ?? ""
            ) && <CancelBookingButton bookingId={booking.id} />}
          </View>
        ) : (
          <View>
            {booking.bookingStatus?.status === "accepted" && (
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
          </View>
        )}
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
    backgroundColor: primaryColor,
    padding: 16,
    borderRadius: 8,
  },
  ownerDetails: {
    backgroundColor: lightGrayColor,
    padding: 16,
    borderRadius: 8,
  },
});
