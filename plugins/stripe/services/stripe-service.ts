import { StripeCardElement, StripeCardNumberElement } from "@stripe/stripe-js";
import {
  createPaymentMethod,
  initPaymentSheet,
  PaymentMethod,
  presentPaymentSheet,
} from "@stripe/stripe-react-native";

import { TStripeService } from "@/plugins/stripe/types";

export class StripeService implements TStripeService {
  // Mobile uses Stripe PaymentSheet
  async payWithPaymentIntent({
    paymentIntentClientSecret,
    merchantDisplayName,
    customerId,
    customerEphemeralKeySecret,
  }: {
    paymentIntentClientSecret: string;
    merchantDisplayName: string;
    customerId?: string;
    customerEphemeralKeySecret?: string;
    cardElement?:
      | StripeCardElement
      | StripeCardNumberElement
      | {
          token: string;
        };
  }): Promise<void> {
    const { error: initError } = await initPaymentSheet({
      paymentIntentClientSecret,
      merchantDisplayName,
      customerId,
      customerEphemeralKeySecret,
    });
    if (initError) throw initError;

    const { error: presentError } = await presentPaymentSheet();
    if (presentError) throw presentError;
  }

  async createPaymentMethod(input: {
    name: string;
    email?: string;
    phone?: string;
    cardElement?: StripeCardElement | StripeCardNumberElement;
  }): Promise<PaymentMethod.Result> {
    const { paymentMethod, error } = await createPaymentMethod({
      paymentMethodType: "Card",
      paymentMethodData: {
        billingDetails: input,
      },
    });

    if (error) throw error;
    return paymentMethod;
  }
}

export const stripeService = new StripeService();
