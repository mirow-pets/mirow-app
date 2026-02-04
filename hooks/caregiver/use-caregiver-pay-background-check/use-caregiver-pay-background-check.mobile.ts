import { useMutation } from "@tanstack/react-query";

import { ENV } from "@/env";
import { TBackgroundCheckInitialPayment } from "@/features/payments/validations";
import { stripeService } from "@/plugins/stripe/services/stripe-service";
import { Post } from "@/services/http-service";
import { TInitialPay } from "@/types/payments";

export const useCaregiverPayBackgroundCheck = () => {
  const { mutate: payBackgroundCheck, isPending: isPayingBackgroundCheck } =
    useMutation<TInitialPay | undefined, Error, TBackgroundCheckInitialPayment>(
      {
        mutationFn: async (input: TBackgroundCheckInitialPayment) => {
          const initialPay = await Post(
            "/v2/background-verifications/payment",
            input
          );

          if (initialPay.isFree) return;

          await stripeService.payWithPaymentIntent({
            paymentIntentClientSecret: initialPay.clientSecret,
            merchantDisplayName: ENV.MERCHANT_NAME,
          });

          return initialPay as TInitialPay;
        },
      }
    );

  return {
    payBackgroundCheck,
    isPayingBackgroundCheck,
  };
};
