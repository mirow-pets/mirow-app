export interface TBankAccount {
  id: string;
  object: string;
  account: string;
  account_holder_name: string | null;
  account_holder_type: string | null;
  account_type: string | null;
  available_payout_methods: string[];
  bank_name: string;
  country: string;
  currency: string;
  default_for_currency: boolean;
  fingerprint: string;
  future_requirements: {
    currently_due: string[];
    errors: string[];
    past_due: string[];
    pending_verification: string[];
  };
  last4: string;
  metadata: unknown;
  requirements: {
    currently_due: string[];
    errors: string[];
    past_due: string[];
    pending_verification: string[];
  };
  routing_number: string;
  status: string;
}

export interface TInitialPay {
  clientSecret: string;
  message: string;
  paymentIntentId: string;
  customerId: string;
}

export interface TPaymentMethod {
  id: string;
  object: string;
  allow_redisplay: string;
  billing_details: {
    address: {
      city: string | null;
      country: string | null;
      line1: string | null;
      line2: string | null;
      postal_code: string | null;
      state: string | null;
    };
    email: string;
    name: string;
    phone: string;
    tax_id: string | null;
  };
  card: {
    brand: string;
    checks: {
      address_line1_check: string | null;
      address_postal_code_check: string;
      cvc_check: string;
    };
    country: string;
    display_brand: string;
    exp_month: number;
    exp_year: number;
    fingerprint: string;
    funding: string;
    generated_from: string | null;
    last4: string;
    networks: {
      available: string[];
      preferred: string | null;
    };
    regulated_status: string;
    three_d_secure_usage: {
      supported: boolean;
    };
    wallet: string | null;
  };
  created: number;
  customer: string;
  customer_account: string | null;
  livemode: boolean;
  metadata: unknown;
  type: string;
}
