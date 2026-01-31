import { TextInputField } from "@/components/form/TextInputField";
import { FormStepsLayout } from "@/components/layout/FormStepsLayout";
import { useAddBooking } from "@/hooks/use-add-booking-form";

export interface AddBookingSpecialInstructionProps {
  progress: number;
}

export const AddBookingSpecialInstruction = ({
  progress,
}: AddBookingSpecialInstructionProps) => {
  const { next, prev } = useAddBooking();

  return (
    <FormStepsLayout {...{ onNext: next([]), onPrev: prev, progress }}>
      <TextInputField
        label="Special instructions / Notes (optional)"
        name="notes"
        numberOfLines={3}
        multiline
      />
    </FormStepsLayout>
  );
};
