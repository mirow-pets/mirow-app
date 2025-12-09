import { Linking, StyleSheet, View } from "react-native";

import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/button/Button";
import { PetAvatar } from "@/components/image/PetAvatar";
import { UserAvatar } from "@/components/image/UserAvatar";
import { ThemedText } from "@/components/themed-text";
import { blueColor, lightGrayColor, whiteColor } from "@/constants/theme";
import { usePayment } from "@/hooks/use-payment";
import { useThemeColor } from "@/hooks/use-theme-color";
import { TBooking } from "@/types";
import { formatTimeToAmPm, formatToDateTextMDY } from "@/utils/date";

export interface BookingDetailsProps {
  booking: TBooking;
  isOwner?: boolean;
}

export default function BookingDetails({
  booking,
  isOwner,
}: BookingDetailsProps) {
  const primaryColor = useThemeColor({}, "primary");
  const { payCaregiver } = usePayment();
  const queryClient = useQueryClient();

  const pet = booking.pets![0]; // Assuming at least one pet for simplicity

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
          <ThemedText type="defaultSemiBold" style={styles.whiteText}>
            {pet.name}
          </ThemedText>
          <ThemedText style={styles.whiteSmallText}>
            Type: {pet.petTypes?.display}
          </ThemedText>
          <ThemedText style={styles.whiteSmallText}>
            Service: {booking.serviceTypes?.display}
          </ThemedText>
          <ThemedText style={styles.whiteSmallText}>
            Gender: {pet.gender ? "Male" : "Female"}
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
        {/* Assuming paymentStatusId 1 means pending payment. This needs to be confirmed. */}
        {isOwner && booking.amount && booking.paymentStatusId === 1 && (
          <Button
            title="Pay Now"
            onPress={() =>
              payCaregiver(
                {
                  amount: +(Number(booking.amount) * 100).toFixed(),
                  caregiverId: booking.careGiversId,
                  bookingId: booking.id,
                },
                () => {
                  queryClient.refetchQueries({
                    queryKey: ["booking", booking.id],
                  });
                }
              )
            }
            size="sm"
          />
        )}
      </View>

      {/* Pet Owner Details Section */}
      <View style={[styles.card, styles.ownerDetailsContainer]}>
        <ThemedText type="defaultSemiBold" style={{ marginBottom: 8 }}>
          Pet Owner
        </ThemedText>
        <View style={styles.ownerInfo}>
          <UserAvatar src={booking?.users?.profileImage} size={64} />
          <View>
            <ThemedText>
              {booking?.users?.firstName} {booking?.users?.lastName}
            </ThemedText>
            {booking?.users?.phone && (
              <View style={styles.phoneContainer}>
                <ThemedText style={styles.smallText}>Phone:</ThemedText>
                <ThemedText
                  style={[styles.smallText, styles.linkText]}
                  onPress={() =>
                    Linking.openURL(`tel:${booking?.users?.phone}`)
                  }
                >
                  {booking?.users?.phone}
                </ThemedText>
              </View>
            )}
            {booking?.users?.address?.[0] && (
              <ThemedText style={styles.smallText}>
                Address: {booking.users.address[0].address},
                {booking.users.address[0].city},{booking.users.address[0].state}
              </ThemedText>
            )}
          </View>
        </View>
      </View>

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
        <InfoRow
          label="Service Started"
          value={
            booking.serviceStartedAt
              ? formatToDateTextMDY(booking.serviceStartedAt) +
                " " +
                formatTimeToAmPm(booking.serviceStartedAt)
              : "Not started yet"
          }
        />
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
  ownerDetailsContainer: {
    backgroundColor: lightGrayColor,
  },
  ownerInfo: {
    flexDirection: "row",
    gap: 16,
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
