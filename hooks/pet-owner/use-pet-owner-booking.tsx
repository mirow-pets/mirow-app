import { createContext, ReactNode, useContext, useState } from "react";

import {
  initPaymentSheet,
  presentPaymentSheet,
} from "@stripe/stripe-react-native";
import {
  UseMutateFunction,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import Toast from "react-native-toast-message";

import { ENV } from "@/env";
import { TCancelBooking, TPayBooking } from "@/features/bookings/validations";
import { useAuth } from "@/hooks/use-auth";
import { useModal } from "@/hooks/use-modal";
import { Get, Patch, Post } from "@/services/http-service";
import { TBooking, TOption, TTrainingType } from "@/types";
import { onError } from "@/utils";

interface TPetOwnerBookingFormFields {
  trainingType: TTrainingType[];
}
export interface PetOwnerBookingContextValues {
  cancelBooking: (_input: TCancelBooking) => void;
  isCancellingBooking: boolean;
  getBooking: (_bookingId: string) => void;
  booking: TBooking;
  isLoadingBooking: boolean;
  payBooking: UseMutateFunction<void, Error, TPayBooking>;
  isPayingBooking: boolean;
  trainingTypeOptions: TOption[];
}

export const PetOwnerBookingContext =
  createContext<PetOwnerBookingContextValues | null>(null);

export interface PetOwnerBookingProviderProps {
  children: ReactNode;
}

const PetOwnerBookingProvider = ({
  children,
}: PetOwnerBookingProviderProps) => {
  const { setOpenId } = useModal();
  const [bookingId, setBookingId] = useState<TBooking["id"]>();
  const { currUser } = useAuth();

  const {
    data: petOwnerBookingFormFields = {
      trainingType: [],
    },
    isLoading: isLoadingPetOwnerBookingFormFields,
  } = useQuery<TPetOwnerBookingFormFields>({
    queryKey: ["pet-owner-booking-fields"],
    queryFn: () => Get("/fields/users/bookings"),
    enabled: !!currUser,
  });

  const {
    data: booking,
    isLoading: isLoadingBooking,
    refetch: refetchBooking,
  } = useQuery({
    queryKey: ["booking", bookingId],
    queryFn: () => Get(`/v2/users/bookings/${bookingId}`),
    enabled: !!bookingId,
  });

  const { mutate: cancel, isPending: isCancellingBooking } = useMutation<
    TBooking,
    Error,
    TCancelBooking
  >({
    mutationFn: ({ bookingId, cancelReason }: TCancelBooking) =>
      Patch(`/users/bookings/${bookingId}/cancel`, { cancelReason }),
    onSuccess: async () => {
      if (bookingId) await Promise.all([refetchBooking()]);
      setOpenId("");

      Toast.show({
        type: "success",
        text1: "Booking cancelled successfully!",
      });
    },
    onError,
  });

  const { mutate: payBooking, isPending: isPayingBooking } = useMutation<
    void,
    Error,
    TPayBooking
  >({
    mutationFn: async (input: TPayBooking) => {
      const payCaregiver = await Post(`/v2/bookings/${input.bookingId}/pay`);

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

  const cancelBooking = (input: TCancelBooking) => cancel(input);

  const getBooking = (bookingId: string) => {
    setBookingId(bookingId);
  };

  const trainingTypeOptions = petOwnerBookingFormFields.trainingType.map(
    ({ display, id }) => ({
      label: display,
      value: id,
    })
  );

  return (
    <PetOwnerBookingContext.Provider
      value={{
        cancelBooking,
        isCancellingBooking,
        getBooking,
        booking,
        isLoadingBooking,
        payBooking,
        isPayingBooking,
        trainingTypeOptions,
      }}
    >
      {children}
    </PetOwnerBookingContext.Provider>
  );
};

export default PetOwnerBookingProvider;

export const usePetOwnerBooking = () => {
  const booking = useContext(PetOwnerBookingContext);

  if (!booking) {
    throw new Error(
      "Cannot access usePetOwnerBooking outside PetOwnerBookingProvider"
    );
  }
  return booking;
};
