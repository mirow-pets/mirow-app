import { ReactNode } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { PetAvatar } from "@/components/image/PetAvatar";
import { ThemedText } from "@/components/themed-text";
import { blueColor, lightGrayColor, whiteColor } from "@/constants/theme";
import { SetAsFavoriteCaregiver } from "@/features/caregivers/components/SetAsFavoriteCaregiver";
import { useAuth } from "@/hooks/use-auth";
import { useThemeColor } from "@/hooks/use-theme-color";
import { TBooking } from "@/types";
import { formatTimeToAmPm, formatToDateTextMDY } from "@/utils/date";

import { PetDetailsCardCard } from "./booking-details/PetDetailsCard";
import { UserDetailsCard } from "./booking-details/UserDetailsCard";

export interface BookingDetailsProps {
  booking: TBooking;
  paymentButton?: ReactNode;
}

export default function BookingDetails({
  booking,
  paymentButton,
}: BookingDetailsProps) {
  const { isPetOwner } = useAuth();

  const primaryColor = useThemeColor({}, "primary");

  const pet = booking.pets![0]; // Assuming at least one pet for simplicity
  const serviceStarted = booking.serviceStartedAt
    ? formatToDateTextMDY(booking.serviceStartedAt) +
      " " +
      formatTimeToAmPm(booking.serviceStartedAt)
    : "Not started yet";

  return (
    <View style={styles.container}>
      {/* Header Section: Pet and Booking Summary */}
      <View
        style={[
          styles.card,
          styles.bookingSummary,
          { backgroundColor: primaryColor },
        ]}
      >
        <PetAvatar src={pet.profileImage} size={100} />
        <View style={styles.summaryTextContainer}>
          <ThemedText style={styles.whiteSmallText}>
            Service: {booking.serviceTypes?.display}
          </ThemedText>
          <ThemedText style={styles.whiteSmallText}>
            Start: {formatToDateTextMDY(booking.startDate)}{" "}
            {formatTimeToAmPm(booking.startDate)}
          </ThemedText>
          {booking.endDate && (
            <ThemedText style={styles.whiteSmallText}>
              End: {formatToDateTextMDY(booking.endDate)}{" "}
              {formatTimeToAmPm(booking.endDate)}
            </ThemedText>
          )}
          <ThemedText style={styles.whiteSmallText}>
            Status: {booking?.bookingStatus?.display}
          </ThemedText>
        </View>
      </View>

      <PetDetailsCardCard
        title="Pet"
        pet={pet}
        actions={
          !isPetOwner ? (
            <TouchableOpacity
              onPress={() =>
                router.push(`/caregiver/bookings/${booking.id}/pet/${pet.id}`)
              }
            >
              <Ionicons name="eye" size={20} />
            </TouchableOpacity>
          ) : null
        }
      />

      {/* Service Fee Section */}
      <View style={[styles.card, styles.serviceFeeContainer]}>
        <ThemedText type="defaultSemiBold" style={{ marginBottom: 8 }}>
          Service Fee
        </ThemedText>
        <InfoRow
          label="Amount"
          value={
            !booking.amount ? "-" : `$${parseFloat(booking.amount).toFixed(2)}`
          }
        />
        {booking.tips > 0 && (
          <InfoRow label="Tips" value={`$${booking.tips.toFixed(2)}`} />
        )}
        {paymentButton}
      </View>

      {/* Pet Owner Details Section */}
      {booking.users && (
        <UserDetailsCard title="Pet Owner" user={booking.users} />
      )}

      {/* Caregiver Details Section */}
      {booking.careGivers?.users && (
        <UserDetailsCard
          title="Caregiver"
          user={booking.careGivers.users}
          actions={
            isPetOwner ? (
              <SetAsFavoriteCaregiver
                isFavourite={booking.careGivers.isFavourite}
                userId={booking.careGivers.usersId}
              />
            ) : null
          }
        />
      )}

      {/* Service Details Section */}
      <View style={[styles.card, styles.serviceDetailsContainer]}>
        <ThemedText type="defaultSemiBold" style={{ marginBottom: 8 }}>
          Service Details
        </ThemedText>
        {/* TODO: Apply this to service with pickup */}
        {/* <InfoRow label="Pickup Location" value={booking.pickupAddressText} />
        {booking.dropupAddressText && (
          <InfoRow label="Dropoff Location" value={booking.dropupAddressText} />
        )} */}
        <InfoRow label="Service Started" value={serviceStarted} />
        {booking.isFeeding && <InfoRow label="Feeding Required" value="Yes" />}
        {booking.notes && <InfoRow label="Notes" value={booking.notes} />}
      </View>

      {/* Cancellation/Rejection Reasons */}
      {booking.cancelReason && (
        <View style={[styles.card, styles.reasonContainer]}>
          <ThemedText type="defaultSemiBold" style={styles.dangerText}>
            Cancellation Reason:
          </ThemedText>
          <ThemedText style={styles.dangerText}>
            {booking.cancelReason}
          </ThemedText>
        </View>
      )}
      {booking.rejectReason && (
        <View style={[styles.card, styles.reasonContainer]}>
          <ThemedText type="defaultSemiBold" style={styles.dangerText}>
            Rejection Reason:
          </ThemedText>
          <ThemedText style={styles.dangerText}>
            {booking.rejectReason}
          </ThemedText>
        </View>
      )}
    </View>
  );
}

// Helper component for displaying info rows
const InfoRow = ({
  label,
  value,
  isLink = false,
  onPress,
}: {
  label: string;
  value?: string | null;
  isLink?: boolean;
  onPress?: () => void;
}) => (
  <View style={styles.infoRow}>
    <ThemedText style={styles.smallText}>{label}:</ThemedText>
    <ThemedText
      style={[styles.smallText, isLink && styles.linkText]}
      onPress={onPress}
    >
      {value || "N/A"}
    </ThemedText>
  </View>
);

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  card: {
    borderRadius: 8,
    padding: 16,
    gap: 8,
  },
  bookingSummary: {
    flexDirection: "row",
    gap: 16,
  },
  summaryTextContainer: {
    flex: 1,
    gap: 4,
  },
  whiteText: {
    color: whiteColor,
  },
  whiteSmallText: {
    fontSize: 12,
    color: whiteColor,
  },
  phoneContainer: {
    flexDirection: "row",
    gap: 4,
  },
  smallText: {
    fontSize: 12,
  },
  linkText: {
    textDecorationLine: "underline",
    color: blueColor,
  },
  serviceDetailsContainer: {
    backgroundColor: lightGrayColor,
  },
  infoRow: {
    flexDirection: "row",
    gap: 4,
    marginBottom: 4,
    alignItems: "center",
  },
  reasonContainer: {
    backgroundColor: lightGrayColor,
    borderLeftWidth: 4,
    borderLeftColor: "red",
  },
  dangerText: {
    color: "red",
    fontSize: 12,
  },
  serviceFeeContainer: {
    backgroundColor: lightGrayColor,
    gap: 8,
  },
  payButton: {
    backgroundColor: blueColor,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  payButtonText: {
    color: whiteColor,
    fontSize: 16,
  },
});
