import { createContext, ReactNode, useContext } from "react";

import {
  UseMutateFunction,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import Toast from "react-native-toast-message";

import { ENV } from "@/env";
import { TPayCaregiver, TTipCaregiver } from "@/features/payments/validations";
import { usePetOwnerProfile } from "@/hooks/pet-owner/use-pet-owner-profile";
import { useAuth } from "@/hooks/use-auth";
import { stripeService } from "@/plugins/stripe/services/stripe-service";
import { Delete, Get, Patch, Post } from "@/services/http-service";
import { TBankAccount, TPaymentMethod } from "@/types";
import { majorToCentUnit, onError } from "@/utils";

export interface PaymentMethodsResponse {
  data: TPaymentMethod[];
  has_more: boolean;
  url: string;
  object: string;
}

export interface PetOwnerPaymentContextValues {
  payCaregiver: (_input: TPayCaregiver, _onSuccess: () => void) => void;
  isPayingCaregiver: boolean;
  tipCaregiver: (_input: TTipCaregiver, _onSuccess: () => void) => void;
  isTippingCaregiver: boolean;
  paymentMethods?: PaymentMethodsResponse;
  isLoadingPaymentMethods: boolean;
  deleteBankAccount: (_bankAccountId: TBankAccount["id"]) => void;
  isDeletingBankAccount: boolean;
  add: UseMutateFunction<any, Error, void, unknown>;
  isAddingPaymentMethod: boolean;
}

export const PetOwnerPaymentContext =
  createContext<PetOwnerPaymentContextValues | null>(null);

export interface PetOwnerPaymentProviderProps {
  children: ReactNode;
}

export const PetOwnerPaymentProvider = ({
  children,
}: PetOwnerPaymentProviderProps) => {
  const { currUser } = useAuth();
  const { profile } = usePetOwnerProfile();
  const queryClient = useQueryClient();

  const {
    data: { cards: paymentMethods } = {},
    isLoading: isLoadingPaymentMethods,
  } = useQuery<{ cards: PaymentMethodsResponse }, Error>({
    queryKey: ["payment-methods", currUser?.sessionId],
    queryFn: () => Get("/payment-method/external-acc/customer"),
    enabled: !!currUser,
  });

  const { mutate: add, isPending: isAddingPaymentMethod } = useMutation({
    mutationFn: async () => {
      const paymentMethod = await stripeService.createPaymentMethod({
        name: `${profile?.firstName} ${profile?.lastName}`,
        email: profile?.email,
        phone: profile?.phone,
      });

      const response = await Post("/payment-method/card/customer", {
        paymentMethodId: paymentMethod.id,
        last4: paymentMethod.Card.last4,
      });

      if (response?.message?.includes("This card is already added.")) {
        throw new Error(response?.message);
      }

      return response;
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

  const { mutate: _payCaregiver, isPending: isPayingCaregiver } = useMutation<
    void,
    Error,
    TPayCaregiver
  >({
    mutationFn: async (input: TPayCaregiver) => {
      const payCaregiver = await Post("/pay/care-giver", input);

      await stripeService.payWithPaymentIntent({
        paymentIntentClientSecret: payCaregiver?.clientSecret,
        merchantDisplayName: ENV.MERCHANT_NAME,
        customerId: payCaregiver?.customerId,
        customerEphemeralKeySecret: payCaregiver?.ephemeralKey,
      });
    },
  });

  const { mutate: _tipCaregiver, isPending: isTippingCaregiver } = useMutation<
    void,
    Error,
    TTipCaregiver
  >({
    mutationFn: async (input: TPayCaregiver) => {
      const amount = majorToCentUnit(input.amount);
      const payCaregiver = await Post("/tip-pay/care-giver", {
        ...input,
        amount,
      });

      await stripeService.payWithPaymentIntent({
        paymentIntentClientSecret: payCaregiver?.clientSecret,
        merchantDisplayName: ENV.MERCHANT_NAME,
        customerId: payCaregiver?.customerId,
        customerEphemeralKeySecret: payCaregiver?.ephemeralKey,
      });

      // TODO: Secure this to the backend
      await Patch(`/tip-pay/care-giver/${input.caregiverId}`, {
        amount,
        bookingId: input.bookingId,
      });
    },
  });

  const payCaregiver = (input: TPayCaregiver, onSuccess: () => void) =>
    _payCaregiver(input, { onSuccess });

  const tipCaregiver = (input: TPayCaregiver, onSuccess: () => void) =>
    _tipCaregiver(input, { onSuccess });

  const deleteBankAccount = (bankAccountId: string) => del(bankAccountId);

  return (
    <PetOwnerPaymentContext.Provider
      value={{
        payCaregiver,
        isPayingCaregiver,
        paymentMethods,
        isLoadingPaymentMethods,
        deleteBankAccount,
        isDeletingBankAccount,
        add,
        isAddingPaymentMethod,
        tipCaregiver,
        isTippingCaregiver,
      }}
    >
      {children}
    </PetOwnerPaymentContext.Provider>
  );
};

export const usePetOwnerPayment = () => {
  const payment = useContext(PetOwnerPaymentContext);

  if (!payment) {
    throw new Error(
      "Cannot access usePetOwnerPayment outside PetOwnerPaymentProvider"
    );
  }
  return payment;
};
