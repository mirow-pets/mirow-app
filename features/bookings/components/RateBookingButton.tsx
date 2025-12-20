import { StyleSheet, TouchableOpacity, View } from "react-native";

import { Entypo } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import { Input } from "@/components/form/Input";
import { Modal } from "@/components/modal/Modal";
import { ThemedText } from "@/components/themed-text";
import { redColor, whiteColor } from "@/constants/theme";
import { rateBookingSchema } from "@/features/bookings/validations";
import { usePetOwnerPayment } from "@/hooks/pet-owner/use-pet-owner-payment";
import { useReview } from "@/hooks/use-review";
import { useThemeColor } from "@/hooks/use-theme-color";
import { TBooking } from "@/types";

import { TRateBooking } from "../validations/rate-booking-schema";

export interface RateBookingButtonProps {
  booking: TBooking;
}

export const RateBookingButton = ({ booking }: RateBookingButtonProps) => {
  const primaryColor = useThemeColor({}, "primary");
  const { tipCaregiver, isTippingCaregiver } = usePetOwnerPayment();
  const { createReview, isCreatingReview } = useReview();

  const form = useForm({
    resolver: zodResolver(rateBookingSchema),
    defaultValues: {
      bookingsId: booking.id,
      careGiversId: booking.careGivers.usersId,
      serviceTypesId: booking.serviceTypesId,
    },
  });

  const values = form.watch();
  const errors = form.formState.errors;

  const submit = ({ tipAmount, ...input }: TRateBooking) => {
    if (!tipAmount) {
      createReview(input);
      return;
    }

    tipCaregiver(
      {
        amount: tipAmount,
        caregiverId: input.careGiversId,
        bookingId: input.bookingsId,
      },
      () => createReview(input)
    );
  };

  return (
    <FormProvider {...form}>
      <Modal
        id="ratings"
        title="Let's rate your Caregiver service"
        trigger={<ThemedText style={{ color: primaryColor }}>Rate</ThemedText>}
        style={{ gap: 16 }}
        onConfirm={form.handleSubmit(submit)}
        disabled={isTippingCaregiver || isCreatingReview}
        loading={isTippingCaregiver || isCreatingReview}
      >
        <View style={{ gap: 16 }}>
          <ThemedText>
            How was the service of {booking?.careGivers?.users?.firstName}{" "}
            {booking?.careGivers?.users?.lastName} ?
          </ThemedText>
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            {[1, 2, 3, 4, 5].map((item) => (
              <TouchableOpacity
                key={item}
                onPress={() => form.setValue("starrating", item)}
              >
                <Entypo
                  key={item}
                  name="star"
                  size={32}
                  style={{ marginHorizontal: 4 }}
                  color={
                    (values.starrating ?? 0) >= item ? "#f4c430" : "#bfbdbc"
                  }
                />
              </TouchableOpacity>
            ))}
          </View>
          <ThemedText style={styles.errorText}>
            {errors?.starrating?.message?.toString()}
          </ThemedText>
          <ThemedText>
            Express your gratitude with a tip. Every tip goes entirely to the
            caregiver.
          </ThemedText>
          <View
            style={{ flexDirection: "row", gap: 16, justifyContent: "center" }}
          >
            {[5, 10, 20, 50].map((amount, idx) => {
              const isActive = values.tipAmount && values.tipAmount === amount;
              const backgroundColor = isActive ? primaryColor : "transparent";
              const color = isActive ? whiteColor : undefined;

              return (
                <TouchableOpacity
                  key={idx}
                  onPress={() => form.setValue("tipAmount", amount)}
                  style={{
                    paddingHorizontal: 8,
                    backgroundColor,
                    borderRadius: 4,
                  }}
                >
                  <ThemedText style={{ color }}>${amount}</ThemedText>
                </TouchableOpacity>
              );
            })}
          </View>

          <Input
            name="feedback"
            label="We Value Your Feedback (optional)"
            multiline
            style={{ maxHeight: 100 }}
          />
        </View>
      </Modal>
    </FormProvider>
  );
};

const styles = StyleSheet.create({
  errorText: {
    color: redColor,
    fontSize: 12,
    height: 16,
  },
});
