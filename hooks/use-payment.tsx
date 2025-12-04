import { createContext, ReactNode, useContext } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import Toast from "react-native-toast-message";

import { TAddBankAccount } from "@/features/payments/validations/add-bank-account-schema";
import { Get, Post } from "@/services/http-service";
import { TBankAccount } from "@/types";

export interface BankAccountsResponse {
  data: TBankAccount[];
  has_more: boolean;
  url: string;
  object: string;
}

export interface PaymentContextValues {
  bankAccounts?: BankAccountsResponse;
  isLoadingBankAccounts: boolean;
  addBankAccount: (_input: TAddBankAccount) => void;
  isAddingBankAccount: boolean;
}

export const PaymentContext = createContext<PaymentContextValues | null>(null);

export interface PaymentProviderProps {
  children: ReactNode;
}

const PaymentProvider = ({ children }: PaymentProviderProps) => {
  const queryClient = useQueryClient();

  const onError = (err: Error) => {
    console.log(err);
    Toast.show({
      type: "error",
      text1: "An unexpected error occurred. Please try again.",
    });
  };

  const { data: bankAccounts, isLoading: isLoadingBankAccounts } = useQuery<
    BankAccountsResponse,
    Error
  >({
    queryKey: ["bank-accounts"],
    queryFn: () => Get("/payment-method/external-accounts/connected-account"),
  });

  const { mutate: add, isPending: isAddingBankAccount } = useMutation({
    mutationFn: (input: TAddBankAccount) =>
      Post("/payment-method/bank/connected-account", input),
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ["bank-accounts"] });

      router.back();

      Toast.show({
        type: "success",
        text1: "A new bank is added successfully",
      });
    },
    onError,
  });

  const addBankAccount = (input: TAddBankAccount) => add(input);

  return (
    <PaymentContext.Provider
      value={{
        bankAccounts,
        isLoadingBankAccounts,
        addBankAccount,
        isAddingBankAccount,
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
