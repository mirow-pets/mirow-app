import { createContext, ReactNode, useContext, useState } from "react";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";

import { TAddBooking, TCancelBooking } from "@/features/bookings/validations";
import { useModal } from "@/hooks/use-modal";
import { Get, Patch, Post } from "@/services/http-service";
import { TBooking } from "@/types";

export interface PetOwnerBookingContextValues {
  bookings: TBooking[];
  isLoadingBookings: boolean;
  addBooking: (_input: TAddBooking) => void;
  isAddingBooking: boolean;
  cancelBooking: (_input: TCancelBooking) => void;
  isCancellingBooking: boolean;
  getBooking: (_bookingId: string) => void;
  booking: TBooking;
  isLoadingBooking: boolean;
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
  const router = useRouter();
  const [bookingId, setBookingId] = useState<TBooking["id"]>();

  const onError = (err: Error) => {
    console.log(err);
    let message = "An unexpected error occurred. Please try again.";

    if ("statusCode" in err && Number(err.statusCode) < 500) {
      message = err.message;
    }

    Toast.show({
      type: "error",
      text1: "Error",
      text2: message,
    });
  };

  const {
    data: bookings = [],
    isLoading: isLoadingBookings,
    refetch: refetchBookings,
  } = useQuery<TBooking[]>({
    queryKey: ["bookings"],
    queryFn: () => Get("/users/bookings"),
    enabled: false,
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

  const { mutate: add, isPending: isAddingBooking } = useMutation<
    TBooking,
    Error,
    TAddBooking
  >({
    mutationFn: ({ serviceTypesId, ...input }: TAddBooking) =>
      Post("/users/bookings/meal-service", input),
    onSuccess: async () => {
      await refetchBookings();
      await refetchBooking();

      router.replace("/pet-owner/bookings");

      Toast.show({
        type: "success",
        text1: "Booking added successfully!",
      });
    },
    onError,
  });

  const { mutate: cancel, isPending: isCancellingBooking } = useMutation<
    TBooking,
    Error,
    TCancelBooking
  >({
    mutationFn: ({ bookingId, cancelReason }: TCancelBooking) =>
      Patch(`/users/bookings/${bookingId}/cancel`, { cancelReason }),
    onSuccess: async () => {
      await refetchBookings();
      await refetchBooking();
      setOpenId("");

      Toast.show({
        type: "success",
        text1: "Booking cancelled successfully!",
      });
    },
    onError,
  });

  const addBooking = (input: TAddBooking) => add(input);

  const cancelBooking = (input: TCancelBooking) => cancel(input);

  const getBooking = (bookingId: string) => {
    setBookingId(bookingId);
  };

  return (
    <PetOwnerBookingContext.Provider
      value={{
        bookings,
        isLoadingBookings,
        addBooking,
        isAddingBooking,
        cancelBooking,
        isCancellingBooking,
        getBooking,
        booking,
        isLoadingBooking,
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
