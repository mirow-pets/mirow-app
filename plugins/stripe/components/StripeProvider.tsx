import {
  StripeProvider as RNStripeProvider,
  StripeProviderProps as RNStripeProviderProps,
} from "@stripe/stripe-react-native";

import { ENV } from "@/env";

export interface StripeProviderProps {
  children: RNStripeProviderProps["children"];
}

export const StripeProvider = ({ children }: StripeProviderProps) => {
  return (
    <RNStripeProvider
      publishableKey={ENV.STRIPE_PUBLISHABLE_KEY}
      merchantIdentifier={ENV.MERCHANT_NAME}
      urlScheme={ENV.URL_SCHEME}
    >
      {children}
    </RNStripeProvider>
  );
};
