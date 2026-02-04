import { StyleSheet, View } from "react-native";

import { zodResolver } from "@hookform/resolvers/zod";
import { Image } from "expo-image";
import { FormProvider, useForm } from "react-hook-form";
import Toast from "react-native-toast-message";

import { Button } from "@/components/button/Button";
import { NumberInput } from "@/components/form/NumberInput";
import { TextInputField } from "@/components/form/TextInputField";
import { blackColor, lightGrayColor } from "@/constants/theme";
import { useCaregiverPayment } from "@/hooks/caregiver/use-caregiver-payment";
import { useAuth } from "@/hooks/use-auth";
import { useExitFormRouteWarning } from "@/hooks/use-exit-form-route";
import { useRefetchQueries } from "@/hooks/use-refetch-queries";

import { addBankAccountSchema, TAddBankAccount } from "../../validations";

export interface AddPaymentMethodFormProps {
  onSuccess: () => void;
  onError: (_errorMessage: string) => void;
}

export const AddCaregiverPaymentMethodForm = ({
  onSuccess,
  onError,
}: AddPaymentMethodFormProps) => {
  const { addBankAccount, isAddingBankAccount } = useCaregiverPayment();
  const { refetch } = useRefetchQueries();
  const { currUser } = useAuth();

  const form = useForm({
    resolver: zodResolver(addBankAccountSchema),
    defaultValues: {
      country: "US",
    },
  });

  useExitFormRouteWarning({
    isDirty: form.formState.isDirty,
    onExit: () => {
      form.reset();
    },
  });

  const handleAdd = (input: TAddBankAccount) => {
    addBankAccount(input, {
      onSuccess: async () => {
        refetch([
          ["payment-methods", currUser?.sessionId],
          ["pet-owner-profile"],
          ["pet-owner-completion"],
        ]);

        Toast.show({
          type: "success",
          text1: "A new bank is added successfully",
        });

        onSuccess();
      },
      onError: (error) => {
        onError(error.message);
      },
    });
  };

  return (
    <FormProvider {...form}>
      <View style={styles.container}>
        {/* Card preview */}
        <Image
          source={require("@/assets/images/card.png")}
          style={styles.cardPreview}
        />

        {/* Form */}
        <View style={styles.formSection}>
          <TextInputField
            label="Account Holder Name"
            name="accHolderName"
            placeholder="Account Holder Name"
          />
          <NumberInput
            label="Account Number"
            name="accNum"
            placeholder="Account Number"
          />
          <NumberInput
            label="Routing Number"
            name="routingNumber"
            placeholder="Routing Number"
          />
        </View>
        <Button
          onPress={form.handleSubmit(handleAdd)}
          disabled={isAddingBankAccount}
        >
          Add card
        </Button>
      </View>
    </FormProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  cardField: {
    width: "100%",
    height: 50,
    marginVertical: 20,
    color: blackColor,
  },
  formSection: {
    backgroundColor: lightGrayColor,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    gap: 12,
  },
  cardPreview: {
    width: "100%",
    aspectRatio: 1.586,
    maxHeight: 800,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    justifyContent: "space-between",
  },
});
