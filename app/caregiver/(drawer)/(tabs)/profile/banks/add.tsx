import React from "react";
import { StyleSheet, View } from "react-native";

import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { FormProvider, useForm } from "react-hook-form";

import { Button } from "@/components/button/Button";
import { Input } from "@/components/form/Input";
import { NumberInput } from "@/components/form/NumberInput";
import { primaryColor } from "@/constants/theme";
import {
  addBankAccountSchema,
  TAddBankAccount,
} from "@/features/payments/validations/add-bank-account-schema";
import { useCaregiverPayment } from "@/hooks/caregiver/use-caregiver-payment";
import { useExitFormRouteWarning } from "@/hooks/use-exit-form-route";

export default function AddBankScreen() {
  const { addBankAccount, isAddingBankAccount } = useCaregiverPayment();

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

  const submit = async (input: TAddBankAccount) => {
    addBankAccount(input, () => {
      form.reset();
      router.back();
    });
  };

  return (
    <FormProvider {...form}>
      <View style={styles.container}>
        <Input
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
        <Button
          title="Save"
          onPress={form.handleSubmit(submit)}
          loading={isAddingBankAccount}
          color="secondary"
        />
      </View>
    </FormProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    padding: 20,
    width: "100%",
    gap: 16,
    backgroundColor: primaryColor,
  },
});
