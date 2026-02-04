import { Platform } from "react-native";

import {
  loadStripe,
  PaymentMethod,
  Stripe,
  StripeCardElement,
  StripeCardNumberElement,
} from "@stripe/stripe-js";

import { TStripeService } from "@/plugins/stripe/types";

export const webStripe = loadStripe(
  process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export class StripeService implements TStripeService {
  private stripeWeb: Stripe | null = null;

  constructor() {
    if (Platform.OS === "web") {
      webStripe.then((stripe) => {
        this.stripeWeb = stripe;
      });
    }
  }

  // 🅱 Mobile = PaymentSheet | Web = Elements
  async payWithPaymentIntent({
    paymentIntentClientSecret,
    merchantDisplayName, // not used in web, but kept for interface compatibility
    customerId,
    customerEphemeralKeySecret,
    cardElement,
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
    if (!this.stripeWeb) throw new Error("Stripe not loaded");
    // For web, payment is confirmed using Elements (card element or a payment token)
    let paymentMethodData: any = {};

    if (cardElement && "token" in cardElement) {
      paymentMethodData = { payment_method: cardElement.token };
    } else if (cardElement) {
      paymentMethodData = {
        payment_method: {
          card: cardElement,
        },
      };
    }

    const { error } = await this.stripeWeb.confirmCardPayment(
      paymentIntentClientSecret,
      paymentMethodData
    );

    if (error) throw error;
  }

  async createPaymentMethod(input: {
    name: string;
    email: string;
    phone: string;
    cardElement?: StripeCardElement | StripeCardNumberElement;
  }): Promise<PaymentMethod> {
    if (!this.stripeWeb) throw new Error("Stripe not loaded");
    if (!input.cardElement) throw new Error("Card element is required");

    const { paymentMethod, error } = await this.stripeWeb.createPaymentMethod({
      type: "card",
      card: input.cardElement,
      billing_details: {
        name: input.name,
        email: input.email,
        phone: input.phone,
      },
    });

    if (error) throw error;

    return paymentMethod;
  }
}

export const stripeService = new StripeService();
