import { useFormContext } from "react-hook-form";

import { DropdownInput } from "@/components/form/DropdownInput";
import { TextInputField } from "@/components/form/TextInputField";
import { FormStepsLayout } from "@/components/layout/FormStepsLayout";
import { TAddBooking } from "@/features/bookings/validations";
import { usePetOwnerBooking } from "@/hooks/pet-owner/use-pet-owner-booking";
import { useAddBooking } from "@/hooks/use-add-booking-form";

export interface AddBookingSelectTrainingTypeProps {
  progress: number;
}

export const AddBookingSelectTrainingType = ({
  progress,
}: AddBookingSelectTrainingTypeProps) => {
  const { handleTrainingTypeNext, prev } = useAddBooking();
  const { trainingTypeOptions } = usePetOwnerBooking();
  const form = useFormContext<TAddBooking>();

  const trainingTypeId = form.watch("trainingTypeId");

  const isCustomTrainingType = trainingTypeOptions.find(
    (option) => option.label === "Custom" && option.value === trainingTypeId
  );

  return (
    <FormStepsLayout
      {...{
        onNext: handleTrainingTypeNext([
          "trainingTypeId",
          "customTrainingType",
        ]),
        onPrev: prev,
        progress,
      }}
    >
      <DropdownInput
        label="Training type"
        name="trainingTypeId"
        placeholder="Select training type"
        options={trainingTypeOptions}
      />
      {isCustomTrainingType && (
        <TextInputField
          label="Custom training type"
          name="customTrainingType"
          placeholder="Enter custom training type"
        />
      )}
    </FormStepsLayout>
  );
};
