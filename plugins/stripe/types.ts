import {
  PaymentMethod,
  StripeCardElement,
  StripeCardNumberElement,
} from "@stripe/stripe-js";
import { PaymentMethod as RNPaymentMethod } from "@stripe/stripe-react-native";

export interface TStripeService {
  payWithPaymentIntent(_input: {
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
  }): Promise<void>;

  createPaymentMethod(_input: {
    name: string;
    email?: string;
    phone?: string;
  }): Promise<RNPaymentMethod.Result | PaymentMethod>;
}
