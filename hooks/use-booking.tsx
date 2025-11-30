import { createContext, ReactNode, useContext, useState } from "react";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";

import { TAddBooking, TCancelBooking } from "@/features/bookings/validations";
import { Get, Patch, Post } from "@/services/http-service";
import { TBooking } from "@/types";

import { useAuth } from "./use-auth";
import { useModal } from "./use-modal";

export interface BookingContextValues {
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

export const BookingContext = createContext<BookingContextValues | null>(null);

export interface BookingProviderProps {
  children: ReactNode;
}

const BookingProvider = ({ children }: BookingProviderProps) => {
  const { setOpenId } = useModal();
  const { currUser } = useAuth();
  const router = useRouter();
  const [bookingId, setBookingId] = useState<TBooking["id"]>();

  const onError = (err: Error) => {
    console.log(err);
    Toast.show({
      type: "error",
      text1: "An unexpected error occurred. Please try again.",
    });
  };

  const {
    data: bookings = [],
    isLoading: isLoadingBookings,
    refetch: refetchBookings,
  } = useQuery<TBooking[]>({
    queryKey: ["bookings"],
    queryFn: () => Get("/users/bookings"),
    enabled: !!currUser,
  });

  let {
    data: booking,
    isLoading: isLoadingBooking,
    refetch: refetchBooking,
  } = useQuery({
    queryKey: ["booking", bookingId],
    queryFn: () => Get(`/users/bookings/${bookingId}`),
    enabled: !!bookingId,
  });

  const { mutate: add, isPending: isAddingBooking } = useMutation<
    TBooking,
    Error,
    TAddBooking
  >({
    mutationFn: (input: TAddBooking) => {
      console.log("input", input);

      return Post("/users/bookings/meal-service", input);
    },
    onSuccess: async () => {
      await refetchBookings();

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
    <BookingContext.Provider
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
    </BookingContext.Provider>
  );
};

export default BookingProvider;

export const useBooking = () => {
  const booking = useContext(BookingContext);

  if (!booking) {
    throw new Error("Cannot access useBooking outside BookingProvider");
  }
  return booking;
};
