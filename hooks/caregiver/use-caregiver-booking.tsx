import { createContext, ReactNode, useContext } from "react";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";

import { TRejectBooking } from "@/features/bookings/validations/reject-booking-schema";
import { useAuth } from "@/hooks/use-auth";
import { useModal } from "@/hooks/use-modal";
import { Get, Patch } from "@/services/http-service";
import { TBooking } from "@/types";

import { useCaregiverProfile } from "./use-caregiver-profile";

export interface CaregiverBookingContextValues {
  bookings: TBooking[];
  isLoadingBookings: boolean;
  acceptBooking: (_bookingId: TBooking["id"]) => void;
  isAcceptingBooking: boolean;
  rejectBooking: (_input: TRejectBooking) => void;
  isRejectingBooking: boolean;
  startBooking: (_bookingId: TBooking["id"]) => void;
  isStartingBooking: boolean;
  completeBooking: (_bookingId: TBooking["id"]) => void;
  isCompletingBooking: boolean;
}

export const CaregiverBookingContext =
  createContext<CaregiverBookingContextValues | null>(null);

export interface CaregiverBookingProviderProps {
  children: ReactNode;
}

const CaregiverBookingProvider = ({
  children,
}: CaregiverBookingProviderProps) => {
  const { setOpenId } = useModal();
  const { currUser } = useAuth();
  const { profileCompletion } = useCaregiverProfile();
  const router = useRouter();

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
  const {
    data: bookings = [],
    isLoading: isLoadingBookings,
    refetch: refetchBookings,
  } = useQuery<TBooking[]>({
    queryKey: ["bookings"],
    queryFn: () => Get("/care-givers/bookings"),
    enabled: !!currUser && profileCompletion?.percentage === 100,
  });

  const { mutate: accept, isPending: isAcceptingBooking } = useMutation<
    { message: string },
    Error,
    TBooking["id"]
  >({
    mutationFn: (bookingId: TBooking["id"]) =>
      Patch(`/care-givers/bookings/${bookingId}/accept`),
    onSuccess: async ({ message }: { message: string }) => {
      if (!message.includes("successfully")) {
        return alert(message);
      }
      await refetchBookings();
      setOpenId("");

      Toast.show({
        type: "success",
        text1: "Booking accepted successfully!",
      });
    },
    onError,
  });

  const { mutate: reject, isPending: isRejectingBooking } = useMutation<
    TBooking,
    Error,
    TRejectBooking
  >({
    mutationFn: ({
      bookingId,
      careGiverQeueuId,
      rejectReason,
    }: TRejectBooking) =>
      Patch(`/care-givers/bookings/${careGiverQeueuId}/${bookingId}/reject`, {
        rejectReason,
      }),
    onSuccess: async () => {
      await refetchBookings();
      setOpenId("");

      router.push("/caregiver/bookings");

      Toast.show({
        type: "success",
        text1: "Booking rejected successfully!",
      });
    },
    onError,
  });

  const { mutate: start, isPending: isStartingBooking } = useMutation<
    TBooking,
    Error,
    TBooking["id"]
  >({
    mutationFn: (bookingId: TBooking["id"]) =>
      Patch(`/care-givers/bookings/${bookingId}/inprogress`),
    onSuccess: async () => {
      await refetchBookings();
      setOpenId("");

      Toast.show({
        type: "success",
        text1: "Booking started successfully!",
      });
    },
    onError,
  });

  const { mutate: complete, isPending: isCompletingBooking } = useMutation<
    TBooking,
    Error,
    TBooking["id"]
  >({
    mutationFn: (bookingId: TBooking["id"]) =>
      Patch(`/care-givers/bookings/${bookingId}/complete`),
    onSuccess: async () => {
      await refetchBookings();
      setOpenId("");

      Toast.show({
        type: "success",
        text1: "Booking completed successfully!",
      });
    },
    onError,
  });

  const acceptBooking = (bookingId: TBooking["id"]) => accept(bookingId);

  const rejectBooking = (input: TRejectBooking) => reject(input);

  const startBooking = (bookingId: TBooking["id"]) => start(bookingId);

  const completeBooking = (bookingId: TBooking["id"]) => complete(bookingId);

  return (
    <CaregiverBookingContext.Provider
      value={{
        bookings,
        isLoadingBookings,
        acceptBooking,
        isAcceptingBooking,
        rejectBooking,
        isRejectingBooking,
        startBooking,
        isStartingBooking,
        completeBooking,
        isCompletingBooking,
      }}
    >
      {children}
    </CaregiverBookingContext.Provider>
  );
};

export default CaregiverBookingProvider;

export const useCaregiverBooking = () => {
  const booking = useContext(CaregiverBookingContext);

  if (!booking) {
    throw new Error(
      "Cannot access useCaregiverBooking outside CaregiverBookingProvider"
    );
  }
  return booking;
};
