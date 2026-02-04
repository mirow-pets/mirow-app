import { CardElement, useElements } from "@stripe/react-stripe-js";
import { useMutation } from "@tanstack/react-query";

import { ENV } from "@/env";
import { TBackgroundCheckInitialPayment } from "@/features/payments/validations";
import { stripeService } from "@/plugins/stripe/services/stripe-service";
import { Post } from "@/services/http-service";
import { TInitialPay } from "@/types/payments";

export const useCaregiverPayBackgroundCheck = () => {
  const element = useElements();

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
            cardElement: element?.getElement(CardElement) ?? undefined,
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
