import { Button } from "@/components/button/Button";
import { usePetOwnerPayBooking } from "@/hooks/pet-owner/use-pet-owner-pay-booking/use-pet-owner-pay-booking";
import { useRefetchQueries } from "@/hooks/use-refetch-queries";
import { TBooking } from "@/types";

export interface PayBookingButtonProps {
  bookingId: TBooking["id"];
  onSuccess: () => void;
}

export const PayBookingButton = ({
  bookingId,
  onSuccess,
}: PayBookingButtonProps) => {
  const { payBooking, isPayingBooking } = usePetOwnerPayBooking();
  const { refetch } = useRefetchQueries();

  const handlePayNow = () => {
    payBooking(
      {
        bookingId,
      },
      {
        onSuccess: () => {
          refetch([["booking", bookingId]]);
          onSuccess();
        },
      }
    );
  };

  return (
    <Button onPress={handlePayNow} size="sm" disabled={isPayingBooking}>
      Pay Now
    </Button>
  );
};
