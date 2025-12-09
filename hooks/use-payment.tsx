import { createContext, ReactNode, useContext } from "react";

import {
  initPaymentSheet,
  presentPaymentSheet,
} from "@stripe/stripe-react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";

import { ENV } from "@/env";
import {
  TBackgroundCheckInitialPayment,
  TPayCaregiver,
} from "@/features/payments/validations";
import { TAddBankAccount } from "@/features/payments/validations/add-bank-account-schema";
import { Delete, Get, Post } from "@/services/http-service";
import { TBankAccount } from "@/types";
import { TInitialPay } from "@/types/payments";
import { UserRole } from "@/types/users";

import { useAuth } from "./use-auth";

export interface BankAccountsResponse {
  data: TBankAccount[];
  has_more: boolean;
  url: string;
  object: string;
}

export interface PaymentContextValues {
  bankAccounts?: BankAccountsResponse;
  isLoadingBankAccounts: boolean;
  addBankAccount: (_input: TAddBankAccount, _onSuccess?: () => void) => void;
  isAddingBankAccount: boolean;
  deleteBankAccount: (_bankAccountId: TBankAccount["id"]) => void;
  isDeletingBankAccount: boolean;
  setAsDefault: (_bankAccountId: TBankAccount["id"]) => void;
  isSettingAsDefault: boolean;
  backgroundCheckInitialPayment: (
    _input: TBackgroundCheckInitialPayment,
    _onSuccess: (_initialPay: TInitialPay) => void
  ) => void;
  isLoadingBackgroundCheckInitialPayment: boolean;
  payCaregiver: (_input: TPayCaregiver, _onSuccess: () => void) => void;
  isPayingCaregiver: boolean;
}

export const PaymentContext = createContext<PaymentContextValues | null>(null);

export interface PaymentProviderProps {
  children: ReactNode;
}

const PaymentProvider = ({ children }: PaymentProviderProps) => {
  const { currUser, userRole } = useAuth();
  const queryClient = useQueryClient();
  const isPetOwner = userRole === UserRole.PetOwner;

  const onError = (err: Error) => {
    console.log(err);
    let message = "An unexpected error occurred. Please try again.";

    if ("statusCode" in err && Number(err.statusCode) < 500) {
      message = err.message;
    }

    Toast.show({
      type: "error",
      text1: message,
    });
  };

  const { data: bankAccounts, isLoading: isLoadingBankAccounts } = useQuery<
    BankAccountsResponse,
    Error
  >({
    queryKey: ["bank-accounts"],
    queryFn: () => Get("/payment-method/external-accounts/connected-account"),
    enabled: !!currUser && !isPetOwner,
  });

  const { mutate: add, isPending: isAddingBankAccount } = useMutation({
    mutationFn: (input: TAddBankAccount) =>
      Post("/payment-method/bank/connected-account", input),
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ["bank-accounts"] });

      Toast.show({
        type: "success",
        text1: "A new bank is added successfully",
      });
    },
    onError,
  });

  const { mutate: del, isPending: isDeletingBankAccount } = useMutation({
    mutationFn: (bankAccountId: string) =>
      Delete(`/payment-method/bank/connected-account/${bankAccountId}`),
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ["bank-accounts"] });

      Toast.show({
        type: "success",
        text1: "A bank is deleted successfully",
      });
    },
    onError,
  });

  const { mutate: setAsDefault, isPending: isSettingAsDefault } = useMutation({
    mutationFn: (bankAccountId: string) =>
      Post(`/payment-method/external-acc/default/connected-account`, {
        externalAccId: bankAccountId,
      }),
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ["bank-accounts"] });

      Toast.show({
        type: "success",
        text1: "A bank set as default successfully",
      });
    },
    onError,
  });

  const {
    mutate: _backgroundCheckInitialPayment,
    isPending: isLoadingBackgroundCheckInitialPayment,
  } = useMutation<TInitialPay, Error, TBackgroundCheckInitialPayment>({
    mutationFn: async (input: TBackgroundCheckInitialPayment) => {
      const initialPay = await Post("/initial-pay/care-giver", input);

      const { error } = await initPaymentSheet({
        paymentIntentClientSecret: initialPay.clientSecret,
        merchantDisplayName: ENV.MERCHANT_NAME,
      });

      if (!error) {
        const { error: presentError } = await presentPaymentSheet();
        if (presentError) {
          throw presentError;
        }
      }

      return initialPay as TInitialPay;
    },
  });

  const { mutate: _payCaregiver, isPending: isPayingCaregiver } = useMutation<
    void,
    Error,
    TPayCaregiver
  >({
    mutationFn: async (input: TPayCaregiver) => {
      const payCaregiver = await Post("/pay/care-giver", input);

      const { error } = await initPaymentSheet({
        paymentIntentClientSecret: payCaregiver?.clientSecret,
        merchantDisplayName: ENV.MERCHANT_NAME,
        customerId: payCaregiver?.customerId,
        customerEphemeralKeySecret: payCaregiver?.ephemeralKey,
      });

      if (!error) {
        const { error: presentError } = await presentPaymentSheet();
        if (presentError) {
          throw presentError;
        }
      }
    },
  });

  const addBankAccount = (input: TAddBankAccount, onSuccess?: () => void) =>
    add(input, { onSuccess });

  const deleteBankAccount = (bankAccountId: string) => del(bankAccountId);

  const backgroundCheckInitialPayment = (
    input: TBackgroundCheckInitialPayment,
    onSuccess: (_initialPay: TInitialPay) => void
  ) =>
    _backgroundCheckInitialPayment(input, {
      onSuccess: async (initialPay: TInitialPay) => {
        Toast.show({
          type: "success",
          text1: "Background check paid successfully",
        });

        onSuccess(initialPay);
      },
    });

  const payCaregiver = (input: TPayCaregiver, onSuccess: () => void) =>
    _payCaregiver(input, { onSuccess });

  return (
    <PaymentContext.Provider
      value={{
        bankAccounts,
        isLoadingBankAccounts,
        addBankAccount,
        isAddingBankAccount,
        deleteBankAccount,
        isDeletingBankAccount,
        setAsDefault,
        isSettingAsDefault,
        backgroundCheckInitialPayment,
        isLoadingBackgroundCheckInitialPayment,
        payCaregiver,
        isPayingCaregiver,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
};

export default PaymentProvider;

export const usePayment = () => {
  const payment = useContext(PaymentContext);

  if (!payment) {
    throw new Error("Cannot access usePayment outside PaymentProvider");
  }
  return payment;
};
