import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import { Input } from "@/components/form/Input";
import { Modal } from "@/components/modal/Modal";
import { ThemedText } from "@/components/themed-text";
import { redColor } from "@/constants/theme";
import { cancelBookingSchema } from "@/features/bookings/validations";
import { usePetOwnerBooking } from "@/hooks/pet-owner/use-pet-owner-booking";
import { TBooking } from "@/types";

export interface CancelBookingButtonProps {
  bookingId: TBooking["id"];
}

export const CancelBookingButton = ({
  bookingId,
}: CancelBookingButtonProps) => {
  const { cancelBooking, isCancellingBooking } = usePetOwnerBooking();

  const form = useForm({
    resolver: zodResolver(cancelBookingSchema),
    defaultValues: {
      bookingId,
    },
  });

  return (
    <FormProvider {...form}>
      <Modal
        id="cancel-booking"
        title="Cancel booking"
        trigger={<ThemedText style={{ color: redColor }}>Cancel</ThemedText>}
        onConfirm={form.handleSubmit(cancelBooking)}
        loading={isCancellingBooking}
      >
        <Input
          label="Reason"
          name="cancelReason"
          placeholder="Please provide a reason for canceling this service"
        />
      </Modal>
    </FormProvider>
  );
};
