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
