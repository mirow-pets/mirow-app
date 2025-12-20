import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { InfiniteFlatList } from "@/components/list/InfiniteFlatList";
import { whiteColor } from "@/constants/theme";
import { TWithdrawal } from "@/types";
import { formatCurrency } from "@/utils";

export default function WithdrawalsScreen() {
  return (
    <View style={styles.container}>
      <InfiniteFlatList<TWithdrawal>
        url="/v2/withdrawals"
        renderItem={({ item, index }) => (
          <View key={index} style={styles.withdrawalCard}>
            <Text style={styles.amount}>
              {formatCurrency(item.amount / 100, item.currency || "usd")}
            </Text>
            <Text style={styles.status}>Status: {item.status}</Text>
            {item.createdAt && (
              <Text style={styles.date}>
                Date: {new Date(item.createdAt).toLocaleString()}
              </Text>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 32,
    flex: 1,
    backgroundColor: whiteColor,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontFamily: "Poppins-Bold",
    marginBottom: 20,
    textAlign: "center",
  },
  withdrawalCard: {
    backgroundColor: "#F5F5F7",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
  },
  amount: {
    fontSize: 18,
    fontFamily: "Poppins-SemiBold",
    color: "#222",
    marginBottom: 4,
  },
  status: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#888",
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: "#888",
  },
  infoText: {
    color: "#888",
    fontSize: 16,
    textAlign: "center",
  },
  errorText: {
    color: "#d00",
    fontSize: 16,
    textAlign: "center",
  },
});
