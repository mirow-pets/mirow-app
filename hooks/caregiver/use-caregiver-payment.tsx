import { createContext, ReactNode, useContext } from "react";

import {
  UseMutateFunction,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import Toast from "react-native-toast-message";

import { TAddBankAccount } from "@/features/payments/validations/add-bank-account-schema";
import { useAuth } from "@/hooks/use-auth";
import { Delete, Get, Post } from "@/services/http-service";
import { TBankAccount } from "@/types";
import { onError } from "@/utils";

import { useCaregiverProfile } from "./use-caregiver-profile";

export interface BankAccountsResponse {
  data: TBankAccount[];
  has_more: boolean;
  url: string;
  object: string;
}

export interface CaregiverPaymentContextValues {
  bankAccounts?: BankAccountsResponse;
  isLoadingBankAccounts: boolean;
  addBankAccount: UseMutateFunction<
    any,
    Error,
    {
      country: string;
      accHolderName: string;
      routingNumber: string;
      accNum: string;
    },
    unknown
  >;
  isAddingBankAccount: boolean;
  deleteBankAccount: (_bankAccountId: TBankAccount["id"]) => void;
  isDeletingBankAccount: boolean;
  setAsDefault: (_bankAccountId: TBankAccount["id"]) => void;
  isSettingAsDefault: boolean;
}

export const CaregiverPaymentContext =
  createContext<CaregiverPaymentContextValues | null>(null);

export interface CaregiverPaymentProviderProps {
  children: ReactNode;
}

const CaregiverPaymentProvider = ({
  children,
}: CaregiverPaymentProviderProps) => {
  const { currUser } = useAuth();
  const queryClient = useQueryClient();
  const { profileCompletion } = useCaregiverProfile();

  const { data: bankAccounts, isLoading: isLoadingBankAccounts } = useQuery<
    BankAccountsResponse,
    Error
  >({
    queryKey: ["bank-accounts"],
    queryFn: () => Get("/payment-method/external-accounts/connected-account"),
    enabled: !!currUser && profileCompletion?.percentage === 100,
  });

  const { mutate: addBankAccount, isPending: isAddingBankAccount } =
    useMutation({
      mutationFn: (input: TAddBankAccount) =>
        Post("/payment-method/bank/connected-account", input),
      onSuccess: async () => {
        const queryKeys = [
          ["bank-accounts"],
          ["caregiver-profile-completion", currUser?.sessionId],
        ];

        await Promise.all(
          queryKeys.map((queryKey) =>
            queryClient.refetchQueries({
              queryKey,
            })
          )
        );

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

  const deleteBankAccount = (bankAccountId: string) => del(bankAccountId);

  return (
    <CaregiverPaymentContext.Provider
      value={{
        bankAccounts,
        isLoadingBankAccounts,
        addBankAccount,
        isAddingBankAccount,
        deleteBankAccount,
        isDeletingBankAccount,
        setAsDefault,
        isSettingAsDefault,
      }}
    >
      {children}
    </CaregiverPaymentContext.Provider>
  );
};

export default CaregiverPaymentProvider;

export const useCaregiverPayment = () => {
  const payment = useContext(CaregiverPaymentContext);

  if (!payment) {
    throw new Error(
      "Cannot access useCaregiverPayment outside CaregiverPaymentProvider"
    );
  }
  return payment;
};
