import { useMutation } from "@tanstack/react-query";

import { ENV } from "@/env";
import { TPayBooking } from "@/features/bookings/validations";
import { stripeService } from "@/plugins/stripe/services/stripe-service";
import { Post } from "@/services/http-service";

export const usePetOwnerPayBooking = () => {
  const { mutate: payBooking, isPending: isPayingBooking } = useMutation<
    void,
    Error,
    TPayBooking
  >({
    mutationFn: async (input: TPayBooking) => {
      const payCaregiver = await Post(`/v2/bookings/${input.bookingId}/pay`);

      await stripeService.payWithPaymentIntent({
        paymentIntentClientSecret: payCaregiver?.clientSecret,
        merchantDisplayName: ENV.MERCHANT_NAME,
        customerId: payCaregiver?.customerId,
        customerEphemeralKeySecret: payCaregiver?.ephemeralKey,
      });
    },
  });

  return { payBooking, isPayingBooking };
};
