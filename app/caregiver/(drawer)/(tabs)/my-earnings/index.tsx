import { ActivityIndicator, StyleSheet, View } from "react-native";

import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";

import { Button } from "@/components/button/Button";
import { ThemedText } from "@/components/themed-text";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Get } from "@/services/http-service";
import { formatCurrency, onError } from "@/utils";

interface BalanceAmount {
  amount: number;
  currency: string;
  source_types?: {
    card: number;
  };
}

interface Balance {
  object: "balance";
  available: BalanceAmount[];
  instant_available: BalanceAmount[];
  livemode: boolean;
  pending: BalanceAmount[];
  refund_and_dispute_prefunding: {
    available: BalanceAmount[];
    pending: BalanceAmount[];
  };
}

interface BalanceResponse {
  balance: Balance;
}

export default function MyEarningsScreen() {
  const primaryColor = useThemeColor({}, "primary");
  const { data, isLoading, isError } = useQuery<BalanceResponse>({
    queryKey: ["balance"],
    queryFn: () => Get("/balance/care-giver"),
    meta: {
      onError,
    },
    refetchOnWindowFocus: true,
  });

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={primaryColor} />
        <ThemedText style={styles.loadingText}>Loading earnings...</ThemedText>
      </View>
    );
  }

  if (isError || !data || !data.balance) {
    return (
      <View style={styles.loadingContainer}>
        <ThemedText style={styles.errorText}>
          Error retrieving earnings. Please try again.
        </ThemedText>
      </View>
    );
  }

  const available = data.balance.available?.[0];
  const pending = data.balance.pending?.[0];
  const totalEarnings = data.balance.instant_available?.[0];

  const handleWithdraw = () => {
    router.push({
      pathname: "/caregiver/my-earnings/withdraw",
      params: {
        available: available.amount,
        currency: available.currency,
        totalEarnings: totalEarnings.amount,
      },
    });
  };

  const handleGoToWithdrawals = () => {
    router.push("/caregiver/my-earnings/withdrawals");
  };

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>My Earnings</ThemedText>
      <View style={styles.earningsCard}>
        <ThemedText style={styles.label}>Available to Withdraw</ThemedText>
        <ThemedText style={styles.amount}>
          {available
            ? formatCurrency(
                +(available.amount / 100).toFixed(2),
                available.currency
              )
            : "$0.00"}
        </ThemedText>
      </View>

      <View style={styles.row}>
        <View style={styles.miniCard}>
          <ThemedText style={styles.miniLabel}>Pending</ThemedText>
          <ThemedText style={styles.miniAmount}>
            {pending
              ? formatCurrency(
                  +(pending.amount / 100).toFixed(2),
                  pending.currency
                )
              : "$0.00"}
          </ThemedText>
        </View>
        <View style={styles.miniCard}>
          <ThemedText style={styles.miniLabel}>Instantly Available</ThemedText>
          <ThemedText style={styles.miniAmount}>
            {totalEarnings
              ? formatCurrency(
                  +(totalEarnings.amount / 100).toFixed(2),
                  totalEarnings.currency
                )
              : "$0.00"}
          </ThemedText>
        </View>
      </View>

      <Button
        title="Withdraw"
        style={{ marginTop: 16 }}
        onPress={handleWithdraw}
      />

      <Button
        title="View Withdrawals"
        style={{ marginTop: 12 }}
        onPress={handleGoToWithdrawals}
        variant="reversed"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#555",
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: "#d33",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 28,
    color: "#24416B",
    textAlign: "center",
  },
  earningsCard: {
    backgroundColor: "#eaf1fd",
    borderRadius: 16,
    alignItems: "center",
    padding: 28,
    marginBottom: 24,
    elevation: 1,
  },
  label: {
    color: "#3a5c82",
    fontSize: 16,
    marginBottom: 6,
  },
  amount: {
    color: "#24416B",
    fontWeight: "bold",
    fontSize: 32,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  miniCard: {
    flex: 1,
    backgroundColor: "#f6fafd",
    borderRadius: 12,
    alignItems: "center",
    padding: 18,
    marginHorizontal: 2,
    elevation: 1,
  },
  miniLabel: {
    color: "#6b7a8f",
    fontSize: 14,
    marginBottom: 4,
  },
  miniAmount: {
    color: "#24416B",
    fontWeight: "600",
    fontSize: 22,
  },
});
