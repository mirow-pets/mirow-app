import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { useQuery } from "@tanstack/react-query";
import { FlatList } from "react-native-gesture-handler";

import { ScrollViewWithRefresh } from "@/components/layout/ScrollViewWithRefresh";
import { whiteColor } from "@/constants/theme";
import { Get } from "@/services/http-service";
import { formatCurrency } from "@/utils";

export default function WithdrawalsScreen() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["payouts"],
    queryFn: () => Get("/v2/caregivers/payouts"),
  });
  return (
    <ScrollViewWithRefresh loading={isLoading} onRefresh={refetch}>
      <View style={styles.container}>
        <FlatList<{
          amount: number;
          currency: string;
          arrival_date: number;
          created: number;
          status: number;
        }>
          data={data}
          renderItem={({ item, index }) => (
            <View key={index} style={styles.withdrawalCard}>
              <Text style={styles.amount}>
                {formatCurrency(item.amount / 100, item.currency || "usd")}
              </Text>
              <Text style={styles.status}>Status: {item.status}</Text>
              {item.created && (
                <Text style={styles.date}>
                  Date created: {new Date(item.created * 1000).toLocaleString()}
                </Text>
              )}
              {item.arrival_date && (
                <Text style={styles.date}>
                  Date of arrival:{" "}
                  {new Date(item.arrival_date * 1000).toLocaleString()}
                </Text>
              )}
            </View>
          )}
          scrollEnabled={false}
        />
      </View>
    </ScrollViewWithRefresh>
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
