import { DateInput } from "@/components/form/DateInput/DateInput";
import { TimeInput } from "@/components/form/TimeInput/TimeInput";
import { FormStepsLayout } from "@/components/layout/FormStepsLayout";
import { useAddBooking } from "@/hooks/use-add-booking-form";

export interface AddBookingSelectDateTimeProps {
  progress: number;
}

export const AddBookingSelectDateTime = ({
  progress,
}: AddBookingSelectDateTimeProps) => {
  const { handleSelectDateTimeNext, prev } = useAddBooking();

  const onNext = handleSelectDateTimeNext([
    "startDate",
    "startTime",
    "endDate",
    "endTime",
  ]);

  return (
    <FormStepsLayout {...{ onNext, onPrev: prev, progress }}>
      <DateInput
        label="Service date"
        name="startDate"
        minimumDate={new Date()}
      />
      <TimeInput
        label="Service time"
        name="startTime"
        minimumDate={new Date()}
      />
      <DateInput label="End date" name="endDate" minimumDate={new Date()} />
      <TimeInput label="End time" name="endTime" minimumDate={new Date()} />
    </FormStepsLayout>
  );
};
