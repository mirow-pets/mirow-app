import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import { Input } from "@/components/form/Input";
import { Modal } from "@/components/modal/Modal";
import { ThemedText } from "@/components/themed-text";
import { redColor } from "@/constants/theme";
import { rejectBookingSchema } from "@/features/bookings/validations";
import { useCaregiverBooking } from "@/hooks/caregiver/use-caregiver-booking";
import { TBooking } from "@/types";
import { TCaregiverQueue } from "@/types/caregivers";

export interface RejectBookingButtonProps {
  careGiverQeueuId: TCaregiverQueue["id"];
  bookingId: TBooking["id"];
}

export const RejectBookingButton = ({
  careGiverQeueuId,
  bookingId,
}: RejectBookingButtonProps) => {
  const { rejectBooking, isRejectingBooking } = useCaregiverBooking();

  const form = useForm({
    resolver: zodResolver(rejectBookingSchema),
    defaultValues: {
      bookingId,
      careGiverQeueuId,
    },
  });

  return (
    <FormProvider {...form}>
      <Modal
        id="reject-booking"
        title="Reject booking"
        trigger={<ThemedText style={{ color: redColor }}>Reject</ThemedText>}
        onConfirm={form.handleSubmit(rejectBooking)}
        loading={isRejectingBooking}
      >
        <Input
          label="Reason"
          name="rejectReason"
          placeholder="Please provide a reason for rejecting this service"
        />
      </Modal>
    </FormProvider>
  );
};
