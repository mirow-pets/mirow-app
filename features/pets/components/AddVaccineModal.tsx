import { Text } from "react-native";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import { DateInput } from "@/components/form/DateInput";
import { TextInputField } from "@/components/form/TextInputField";
import { Modal } from "@/components/modal/Modal";
import { useModal } from "@/hooks/use-modal";

interface VaccineData {
  vaccinatedAt: Date;
  nextDueDate: Date;
  vaccineName: string;
}

const vaccineSchema = z.object({
  vaccineName: z.string().nonempty({ message: "Vaccine name is required" }),
  vaccinatedAt: z.date(),
  nextDueDate: z.date(),
});

type TVaccineValues = z.infer<typeof vaccineSchema>;

export interface AddVaccineModalProps {
  onAdded: (_vaccine: VaccineData) => void;
}

export const AddVaccineModal = ({ onAdded }: AddVaccineModalProps) => {
  const { setOpenId } = useModal();

  const form = useForm({
    resolver: zodResolver(vaccineSchema),
  });

  const confirm = (values: TVaccineValues) => {
    onAdded(values);
    setOpenId("");
    form.reset();
  };

  return (
    <FormProvider {...form}>
      <Modal
        id="add-vaccine"
        title="Add vaccine"
        trigger={<Text>Add</Text>}
        onConfirm={form.handleSubmit(confirm)}
      >
        <TextInputField label="Vaccine name" name="vaccineName" />
        <DateInput label="Given at" name="vaccinatedAt" />
        <DateInput label="Due date" name="nextDueDate" />
      </Modal>
    </FormProvider>
  );
};
