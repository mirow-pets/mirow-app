import React, { useMemo } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { FormProvider, useForm } from "react-hook-form";
import Toast from "react-native-toast-message";
import { z } from "zod";

import { Button } from "@/components/button/Button";
import { NumberInput } from "@/components/form/NumberInput";
import { ThemedText } from "@/components/themed-text";
import { useCaregiverPayment } from "@/hooks/caregiver/use-caregiver-payment";
import { Post } from "@/services/http-service";
import {
  confirm,
  formatCurrency,
  onError,
  toMajorUnit,
  toMinorUnit,
} from "@/utils";

const getSchema = (available: number) => {
  const amount = z
    .string()
    .refine(
      (val) => {
        if (!val) return false;
        const num = parseFloat(val);
        return !isNaN(num);
      },
      { message: "Please enter a valid amount" }
    )
    .refine(
      (val) => {
        const num = parseFloat(val);
        return num > 0;
      },
      { message: "Amount must be greater than zero" }
    )
    .refine(
      (val) => {
        const num = parseFloat(val);
        return num <= available;
      },
      { message: "Amount exceeds your available balance" }
    );

  return z.object({
    amount,
  });
};

// Zod schema - needs to be created inside component so it has dependencies
export default function WithdrawScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const queryClient = useQueryClient();

  // Expect available, currency, totalEarnings from params
  const available =
    typeof params.available === "string"
      ? Number(params.available)
      : typeof params.available === "number"
      ? params.available
      : 0;
  const currency = params.currency?.toString() || "usd";
  const totalEarnings =
    typeof params.totalEarnings === "string"
      ? Number(params.totalEarnings)
      : typeof params.totalEarnings === "number"
      ? params.totalEarnings
      : 0;

  // In backend, all amounts are in cents, show in dollars
  const availableDisplay = toMajorUnit(available);
  const totalEarningsDisplay = toMajorUnit(totalEarnings);

  const { bankAccounts } = useCaregiverPayment();

  // Find default bank account (Stripe marks with .default_for_currency)
  const defaultBank = useMemo(
    () =>
      bankAccounts?.data?.find((b: any) => b.default_for_currency) ??
      bankAccounts?.data?.[0],
    [bankAccounts]
  );

  const schema = getSchema(availableDisplay);

  type FormData = z.infer<typeof schema>;

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: { amount: "" },
  });

  const {
    handleSubmit,
    formState: { isValid },
  } = form;

  const { mutate: withdraw, isPending: isWithdrawing } = useMutation({
    mutationFn: (amount: number) => Post("/v2/withdrawals/request", { amount }),
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: ["balance"],
      });
      router.back();
      Toast.show({
        type: "success",
        text1: "Your withdrawal was successful!",
      });
    },
    onError,
  });

  // Withdraw form submit handler
  const onSubmit = (data: FormData) => {
    const num = toMinorUnit(data.amount);

    confirm({
      title: "Confirm Withdrawal",
      description: `Are you sure you want to withdraw ${formatCurrency(
        parseFloat(data.amount),
        currency
      )}?`,
      onConfirm: () => withdraw(num),
    });
  };

  return (
    <FormProvider {...form}>
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: "#fff" }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <ThemedText style={styles.screenTitle}>Withdraw Funds</ThemedText>
          <View style={styles.cards}>
            <View style={styles.rowBetween}>
              <Text style={styles.label}>Total Earnings</Text>
              <Text style={styles.value}>
                {formatCurrency(totalEarningsDisplay, currency)}
              </Text>
            </View>
            <View style={styles.rowBetween}>
              <Text style={styles.label}>Withdrawable Amount</Text>
              <Text style={styles.value}>
                {formatCurrency(availableDisplay, currency)}
              </Text>
            </View>
            <View style={styles.rowBetween}>
              <Text style={styles.label}>Credited to</Text>
              <View style={{ alignItems: "flex-end" }}>
                <Text style={[styles.value, { fontSize: 14 }]}>
                  {defaultBank?.bank_name || "-"}
                </Text>
                {!!defaultBank && (
                  <Text style={[styles.value, { fontSize: 12 }]}>
                    Acc No: (xxxx {defaultBank?.last4 || "--"})
                  </Text>
                )}
              </View>
            </View>
          </View>

          <NumberInput name="amount" editable={!isWithdrawing} />

          <Button
            title="Withdraw"
            onPress={handleSubmit(onSubmit)}
            style={styles.cta}
            disabled={isWithdrawing || !isValid}
            loading={isWithdrawing}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </FormProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    minHeight: "100%",
    backgroundColor: "#fff",
  },
  cards: {
    backgroundColor: "#eaf1fd",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  label: {
    color: "#557CA4",
    fontWeight: "500",
    fontSize: 15,
  },
  value: {
    color: "#24416B",
    fontWeight: "600",
    fontSize: 15,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 28,
    color: "#24416B",
    textAlign: "center",
  },
  inputLabel: {
    color: "#24416B",
    fontWeight: "500",
    marginBottom: 6,
    marginLeft: 2,
    fontSize: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d4d7dd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontWeight: "500",
    backgroundColor: "#fff",
    marginBottom: 2,
  },
  error: {
    color: "#d33",
    marginTop: 4,
    fontSize: 13,
    marginBottom: 10,
    marginLeft: 2,
  },
  cta: {
    marginTop: 24,
    borderRadius: 8,
  },
});
