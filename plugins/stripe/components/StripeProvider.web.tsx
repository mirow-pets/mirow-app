import { ReactNode } from "react";

import { Elements } from "@stripe/react-stripe-js";

import { webStripe } from "@/plugins/stripe/services/stripe-service.web";

export interface StripeProviderProps {
  children: ReactNode;
}

// Web build: do not import `@stripe/stripe-react-native`.
// If/when you add Stripe Elements support on web, wrap children here.
export const StripeProvider = ({ children }: StripeProviderProps) => {
  return <Elements stripe={webStripe}>{children}</Elements>;
};
