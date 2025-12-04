import { StyleSheet, TouchableOpacity, View } from "react-native";

import { router } from "expo-router";
import { FlatList, ScrollView } from "react-native-gesture-handler";

import { Button } from "@/components/button/Button";
import { Loader } from "@/components/loader";
import { ThemedText } from "@/components/themed-text";
import { primaryColor } from "@/constants/theme";
import { usePayment } from "@/hooks/use-payment";

export default function BanksScreen() {
  const { bankAccounts, isLoadingBankAccounts } = usePayment();

  if (isLoadingBankAccounts) {
    return <Loader />;
  }

  return (
    <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="handled">
      <View style={styles.container}>
        <Button
          title="Add Bank"
          size="sm"
          onPress={() => router.push("/caregiver/profile/banks/add")}
        />
        <FlatList
          scrollEnabled={false}
          data={bankAccounts?.data ?? []}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity
                key={index}
                style={styles.itemContainer}
                // onPress={() => handleView(item.id)}
              >
                <View
                  style={{
                    flex: 1,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <ThemedText type="defaultSemiBold">
                      {item.bank_name}
                    </ThemedText>
                    {item.default_for_currency && (
                      <ThemedText style={{ color: primaryColor, fontSize: 12 }}>
                        Default
                      </ThemedText>
                    )}
                  </View>
                  <ThemedText style={{ fontSize: 12 }}>
                    Acc Holder: {item.account_holder_name}
                  </ThemedText>
                  <ThemedText style={{ fontSize: 12 }}>
                    Acc no: {item.last4}
                  </ThemedText>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    width: "100%",
    gap: 8,
  },
  itemContainer: {
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    borderWidth: 1,
    borderRadius: 8,
  },
});
